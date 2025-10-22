import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import path from "node:path";

import { XMLParser } from "fast-xml-parser";

import {
  getDefaultTranslation,
  resolveTranslation,
  type TranslationConfig,
} from "@/lib/passages/translation-metadata";

interface FetchPassageArgs {
  osis: string;
  translation?: string;
  includeContext: boolean;
}

interface PassageText {
  osis: string;
  translation: string;
  translationId: string;
  verses: { reference: string; text: string }[];
  context?: {
    previous?: string;
    next?: string;
  };
}

interface FetchBatchPassageArgs {
  references: string[];
  translation?: string;
  includeContext: boolean;
}

interface VersePointer {
  bookOsis: string;
  chapter: number;
  verse: number;
}

interface VerseData {
  reference: string;
  text: string;
}

interface ChapterData {
  verses: Map<number, VerseData>;
  verseNumbers: number[];
}

interface BookData {
  name: string;
  osis: string;
  chapters: Map<number, ChapterData>;
  chapterNumbers: number[];
  order: number;
}

interface BibleData {
  translation: TranslationConfig;
  books: Map<string, BookData>;
}

const BOOK_OSIS_BY_NUMBER: string[] = [
  "",
  "Gen",
  "Exod",
  "Lev",
  "Num",
  "Deut",
  "Josh",
  "Judg",
  "Ruth",
  "1Sam",
  "2Sam",
  "1Kgs",
  "2Kgs",
  "1Chr",
  "2Chr",
  "Ezra",
  "Neh",
  "Esth",
  "Job",
  "Ps",
  "Prov",
  "Eccl",
  "Song",
  "Isa",
  "Jer",
  "Lam",
  "Ezek",
  "Dan",
  "Hos",
  "Joel",
  "Amos",
  "Obad",
  "Jonah",
  "Mic",
  "Nah",
  "Hab",
  "Zeph",
  "Hag",
  "Zech",
  "Mal",
  "Matt",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Rom",
  "1Cor",
  "2Cor",
  "Gal",
  "Eph",
  "Phil",
  "Col",
  "1Thess",
  "2Thess",
  "1Tim",
  "2Tim",
  "Titus",
  "Phlm",
  "Heb",
  "Jas",
  "1Pet",
  "2Pet",
  "1John",
  "2John",
  "3John",
  "Jude",
  "Rev",
];

const BOOK_ORDER = new Map<string, number>(
  BOOK_OSIS_BY_NUMBER.map((osis, index) => [osis, index]),
);

const BOOK_OSIS_CANONICAL = (() => {
  const map = new Map<string, string>();
  for (const osis of BOOK_OSIS_BY_NUMBER) {
    if (!osis) continue;
    const upper = osis.toUpperCase();
    map.set(upper, osis);
    map.set(upper.replace(/\./g, ""), osis);
  }
  return map;
})();

const DATA_DIRECTORY = path.join(process.cwd(), "data", "bibles");
const COMPILED_DATA_DIRECTORY = path.join(process.cwd(), "data", "bibles-compiled");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
});

const bibleCache = new Map<string, BibleData>();
const biblePromises = new Map<string, Promise<BibleData | null>>();

const defaultTranslation = getDefaultTranslation();
void loadBible(defaultTranslation)
  .then((loaded) => {
    if (loaded) {
      console.info("Warmed default bible translation", {
        translation: defaultTranslation.id,
      });
    }
  })
  .catch((error) => {
    console.error("Failed to warm default translation", { translation: defaultTranslation.id, error });
  });

export async function fetchPassageText(args: FetchPassageArgs): Promise<PassageText | null> {
  const translation = resolveTranslation(args.translation) ?? getDefaultTranslation();
  const bible = await loadBible(translation);
  if (!bible) {
    return null;
  }

  return buildPassageResponse(bible, args.osis, args.includeContext);
}

export async function fetchBatchPassageText(args: FetchBatchPassageArgs): Promise<(PassageText | null)[]> {
  const translation = resolveTranslation(args.translation) ?? getDefaultTranslation();
  const bible = await loadBible(translation);
  if (!bible) {
    return args.references.map(() => null);
  }

  return args.references.map((osis) => buildPassageResponse(bible, osis, args.includeContext));
}
async function loadBible(translation: TranslationConfig): Promise<BibleData | null> {
  const cached = bibleCache.get(translation.id);
  if (cached) {
    console.debug("Bible cache hit", { translation: translation.id });
    return cached;
  }

  const inflight = biblePromises.get(translation.id);
  if (inflight) {
    return inflight;
  }

  const promise: Promise<BibleData | null> = (async () => {
    const start = performance.now();
    try {
      const { bible, source } = await resolveBibleData(translation);
      if (!bible) {
        console.warn("Loaded bible had no data", { translation: translation.id, source });
        return null;
      }

      bibleCache.set(translation.id, bible);
      const duration = Math.round(performance.now() - start);
      console.info("Loaded bible translation", {
        translation: translation.id,
        durationMs: duration,
        books: bible.books.size,
        source,
      });
      return bible;
    } catch (error) {
      console.error("Failed to load bible", { translation: translation.id, error });
      return null;
    } finally {
      biblePromises.delete(translation.id);
    }
  })();

  biblePromises.set(translation.id, promise);
  return promise;
}

export async function parseBibleFromXml(translation: TranslationConfig): Promise<BibleData | null> {
  const filePath = path.join(DATA_DIRECTORY, translation.file);

  try {
    const xml = await readFile(filePath, "utf8");
    const parsed = parser.parse(xml) as Record<string, unknown>;

    const containers: Record<string, unknown>[] = [];
    const candidateContainers = [
      parsed.XMLBIBLE,
      parsed.XMLBible,
      parsed.xmlbible,
      parsed.BIBLE,
      parsed.Bible,
      parsed.bible,
    ];

    for (const candidate of candidateContainers) {
      if (candidate && typeof candidate === "object") {
        containers.push(candidate as Record<string, unknown>);
      }
    }

    if (containers.length === 0) {
      containers.push(parsed);
    }

    let booksNode: unknown;
    for (const container of containers) {
      booksNode = pickProperty(container, ["BIBLEBOOK", "BibleBook", "biblebook", "BOOK", "Book", "book", "b"]);
      if (booksNode !== undefined) {
        break;
      }
    }

    const booksArray = ensureArray(booksNode);
    const books = new Map<string, BookData>();
    let sequentialBookIndex = 0;

    for (const bookNode of booksArray) {
      if (!bookNode || typeof bookNode !== "object") continue;
      const record = bookNode as Record<string, unknown>;
      const fallbackIndex = sequentialBookIndex + 1;
      const bnumber = toInteger(pickProperty(record, ["bnumber", "bnum", "number"]));
      const bookNumber = bnumber ?? fallbackIndex;
      const bookOsis = resolveBookOsis(record, bookNumber);
      const bookName = pickString(record, ["bname", "name", "n", "title"]) ?? bookOsis;
      if (!bookOsis || !bookName) {
        sequentialBookIndex = fallbackIndex;
        continue;
      }

      const chapterNodes = ensureArray(pickProperty(record, ["CHAPTER", "Chapter", "chapter", "c"]));
      const chapters = new Map<number, ChapterData>();
      const chapterNumbers: number[] = [];

      for (const chapterNode of chapterNodes) {
        if (!chapterNode || typeof chapterNode !== "object") continue;
        const chapterRecord = chapterNode as Record<string, unknown>;
        const cnumber = toInteger(pickProperty(chapterRecord, ["cnumber", "cnum", "number", "n"]));
        if (!Number.isInteger(cnumber)) continue;

        const verseNodes = ensureArray(pickProperty(chapterRecord, ["VERS", "Vers", "vers", "VERSE", "verse", "v"]));
        const verses = new Map<number, VerseData>();
        const verseNumbers: number[] = [];

        for (const verseNode of verseNodes) {
          if (!verseNode || (typeof verseNode !== "string" && typeof verseNode !== "object")) continue;
          const verseRecord = typeof verseNode === "object" ? verseNode as Record<string, unknown> : undefined;
          const vnumber = verseRecord ? toInteger(pickProperty(verseRecord, ["vnumber", "vnum", "number", "n"])) : undefined;
          if (!Number.isInteger(vnumber)) continue;

          const normalizedText = extractVerseText(verseNode);
          verses.set(vnumber, {
            reference: `${bookName} ${cnumber}:${vnumber}`,
            text: normalizedText,
          });
          if (!verseNumbers.includes(vnumber)) {
            verseNumbers.push(vnumber);
          }
        }

        verseNumbers.sort((a, b) => a - b);

        if (verseNumbers.length > 0) {
          chapters.set(cnumber, {
            verses,
            verseNumbers,
          });
          chapterNumbers.push(cnumber);
        }
      }

      chapterNumbers.sort((a, b) => a - b);

      if (chapterNumbers.length > 0) {
        books.set(bookOsis, {
          name: bookName,
          osis: bookOsis,
          chapters,
          chapterNumbers,
          order: BOOK_ORDER.get(bookOsis) ?? Number.MAX_SAFE_INTEGER,
        });
      }
      sequentialBookIndex = fallbackIndex;
    }

    if (books.size === 0) {
      return null;
    }

    return {
      translation,
      books,
    } satisfies BibleData;
  } catch (error) {
    console.error("Failed to parse bible xml", { translation: translation.id, error });
    return null;
  }
}

async function resolveBibleData(translation: TranslationConfig): Promise<{ bible: BibleData | null; source: "json" | "xml" }> {
  const compiled = await loadCompiledBible(translation);
  if (compiled) {
    return { bible: compiled, source: "json" };
  }

  const parsed = await parseBibleFromXml(translation);
  return { bible: parsed, source: "xml" };
}

async function loadCompiledBible(translation: TranslationConfig): Promise<BibleData | null> {
  const filePath = path.join(COMPILED_DATA_DIRECTORY, `${translation.id}.json`);
  try {
    const raw = await readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as SerializedBibleData;
    const bible = deserializeBibleData(payload);
    if (!bible || bible.books.size === 0) {
      console.warn("Compiled bible had no data", { translation: translation.id });
      return null;
    }
    return bible;
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && (error as { code?: unknown }).code === "ENOENT") {
      return null;
    }
    console.error("Failed to load compiled bible", { translation: translation.id, error });
    return null;
  }
}

function buildPassageResponse(bible: BibleData, osis: string, includeContext: boolean): PassageText | null {
  const versePointers = expandOsis(bible, osis);
  if (versePointers.length === 0) {
    console.warn("No verse pointers parsed for", { osis, translation: bible.translation.id });
    return null;
  }

  const verses: VerseData[] = [];
  for (const pointer of versePointers) {
    const verse = getVerseData(bible, pointer);
    if (!verse) {
      console.warn("Missing verse data", { osis, pointer, translation: bible.translation.id });
      return null;
    }
    verses.push(verse);
  }

  const response: PassageText = {
    osis,
    translation: bible.translation.label,
    translationId: bible.translation.id,
    verses: verses.map((verse) => ({ reference: verse.reference, text: verse.text })),
  };

  if (includeContext) {
    const previousPointer = getPreviousPointer(bible, versePointers[0]);
    const nextPointer = getNextPointer(bible, versePointers[versePointers.length - 1]);
    response.context = {
      previous: previousPointer ? formatContextVerse(bible, previousPointer) : undefined,
      next: nextPointer ? formatContextVerse(bible, nextPointer) : undefined,
    };
  }

  return response;
}

function expandOsis(bible: BibleData, osis: string): VersePointer[] {
  const result: VersePointer[] = [];
  const segments = osis.split(/[;,]/);
  let previousPointer: VersePointer | undefined;

  for (const rawSegment of segments) {
    const segment = rawSegment.trim();
    if (!segment) continue;

    if (segment.includes("-")) {
      const [startPart, endPart] = segment.split("-");
      const startPointer = parseFirstPointer(bible, startPart, previousPointer);
      const endPointer = parseLastPointer(bible, endPart, startPointer ?? previousPointer);
      if (!startPointer || !endPointer) continue;

      const range = collectRange(bible, startPointer, endPointer);
      result.push(...range);
      previousPointer = range.at(-1) ?? previousPointer;
    } else {
      const pointers = parseAllPointers(bible, segment, previousPointer);
      if (pointers.length === 0) continue;
      result.push(...pointers);
      previousPointer = pointers.at(-1) ?? previousPointer;
    }
  }

  return result;
}

function parseAllPointers(bible: BibleData, expression: string, fallback?: VersePointer): VersePointer[] {
  const trimmedExpression = expression.trim();
  const components = extractComponents(trimmedExpression);
  let bookOsis = components.book ?? fallback?.bookOsis;
  if (!bookOsis) return [];

  const digitOnly = /^[0-9]+$/.test(trimmedExpression);
  if (!components.book && digitOnly && !trimmedExpression.includes(".")) {
    if (fallback) {
      components.chapter = fallback.chapter;
      components.verse = Number.parseInt(trimmedExpression, 10);
      bookOsis = fallback.bookOsis ?? bookOsis;
    }
  }

  const book = bible.books.get(bookOsis);
  if (!book) return [];

  const chapter = components.chapter ?? fallback?.chapter;
  if (!bookOsis) return [];
  if (chapter === undefined) {
    return book.chapterNumbers.flatMap((chapterNumber) => {
      const chapterData = book.chapters.get(chapterNumber);
      if (!chapterData) return [];
      return chapterData.verseNumbers.map((verseNumber) => ({
        bookOsis,
        chapter: chapterNumber,
        verse: verseNumber,
      } satisfies VersePointer));
    });
  }

  const chapterData = book.chapters.get(chapter);
  if (!chapterData) return [];

  if (components.verse === undefined) {
    return chapterData.verseNumbers.map((verseNumber) => ({
      bookOsis,
      chapter,
      verse: verseNumber,
    } satisfies VersePointer));
  }

  const verse = components.verse;
  if (!chapterData.verses.has(verse)) return [];

  return [{ bookOsis, chapter, verse }];
}

function parseFirstPointer(bible: BibleData, expression: string, fallback?: VersePointer): VersePointer | undefined {
  const pointers = parseAllPointers(bible, expression, fallback);
  return pointers[0];
}

function parseLastPointer(bible: BibleData, expression: string, fallback?: VersePointer): VersePointer | undefined {
  const pointers = parseAllPointers(bible, expression, fallback);
  return pointers.at(-1);
}

function collectRange(bible: BibleData, start: VersePointer, end: VersePointer): VersePointer[] {
  const range: VersePointer[] = [];
  let current: VersePointer | undefined = start;

  while (current) {
    range.push(current);
    if (comparePointers(current, end) >= 0) break;
    current = getNextPointer(bible, current);
  }

  return range;
}

function getNextPointer(bible: BibleData, pointer: VersePointer): VersePointer | undefined {
  const book = bible.books.get(pointer.bookOsis);
  if (!book) return undefined;

  const chapter = book.chapters.get(pointer.chapter);
  if (!chapter) return undefined;

  const verseIndex = chapter.verseNumbers.indexOf(pointer.verse);
  if (verseIndex >= 0 && verseIndex + 1 < chapter.verseNumbers.length) {
    return {
      bookOsis: pointer.bookOsis,
      chapter: pointer.chapter,
      verse: chapter.verseNumbers[verseIndex + 1],
    };
  }

  const chapterIndex = book.chapterNumbers.indexOf(pointer.chapter);
  if (chapterIndex >= 0 && chapterIndex + 1 < book.chapterNumbers.length) {
    const nextChapterNumber = book.chapterNumbers[chapterIndex + 1];
    const nextChapter = book.chapters.get(nextChapterNumber);
    const nextVerse = nextChapter?.verseNumbers[0];
    if (nextChapter && nextVerse !== undefined) {
      return {
        bookOsis: pointer.bookOsis,
        chapter: nextChapterNumber,
        verse: nextVerse,
      };
    }
  }

  const nextBookOsis = findAdjacentBook(pointer.bookOsis, 1);
  if (!nextBookOsis) return undefined;

  const nextBook = bible.books.get(nextBookOsis);
  if (!nextBook) return undefined;

  const firstChapter = nextBook.chapterNumbers[0];
  const firstVerse = nextBook.chapters.get(firstChapter)?.verseNumbers[0];
  if (firstChapter === undefined || firstVerse === undefined) {
    return undefined;
  }

  return {
    bookOsis: nextBookOsis,
    chapter: firstChapter,
    verse: firstVerse,
  };
}

function getPreviousPointer(bible: BibleData, pointer: VersePointer): VersePointer | undefined {
  const book = bible.books.get(pointer.bookOsis);
  if (!book) return undefined;

  const chapter = book.chapters.get(pointer.chapter);
  if (!chapter) return undefined;

  const verseIndex = chapter.verseNumbers.indexOf(pointer.verse);
  if (verseIndex > 0) {
    return {
      bookOsis: pointer.bookOsis,
      chapter: pointer.chapter,
      verse: chapter.verseNumbers[verseIndex - 1],
    };
  }

  const chapterIndex = book.chapterNumbers.indexOf(pointer.chapter);
  if (chapterIndex > 0) {
    const prevChapterNumber = book.chapterNumbers[chapterIndex - 1];
    const prevChapter = book.chapters.get(prevChapterNumber);
    const prevVerse = prevChapter?.verseNumbers.at(-1);
    if (prevChapter && prevVerse !== undefined) {
      return {
        bookOsis: pointer.bookOsis,
        chapter: prevChapterNumber,
        verse: prevVerse,
      };
    }
  }

  const previousBookOsis = findAdjacentBook(pointer.bookOsis, -1);
  if (!previousBookOsis) return undefined;

  const previousBook = bible.books.get(previousBookOsis);
  if (!previousBook) return undefined;

  const lastChapter = previousBook.chapterNumbers.at(-1);
  const lastVerse = lastChapter ? previousBook.chapters.get(lastChapter)?.verseNumbers.at(-1) : undefined;
  if (lastChapter === undefined || lastVerse === undefined) {
    return undefined;
  }

  return {
    bookOsis: previousBookOsis,
    chapter: lastChapter,
    verse: lastVerse,
  };
}

function extractComponents(expression: string): { book?: string; chapter?: number; verse?: number } {
  const trimmed = expression.trim();
  if (!trimmed) return {};

  const parts = trimmed.split(".");
  const [first, second, third] = parts;

  const book = first && !/^[0-9]+$/.test(first) ? first : undefined;
  const chapterToken = book ? second : first;
  const verseToken = book ? third : second;

  const chapter = chapterToken && /^[0-9]+$/.test(chapterToken)
    ? Number.parseInt(chapterToken, 10)
    : undefined;

  const verse = verseToken && /^[0-9]+$/.test(verseToken)
    ? Number.parseInt(verseToken, 10)
    : undefined;

  return { book, chapter, verse };
}

function getVerseData(bible: BibleData, pointer: VersePointer): VerseData | undefined {
  const book = bible.books.get(pointer.bookOsis);
  const chapter = book?.chapters.get(pointer.chapter);
  return chapter?.verses.get(pointer.verse);
}

function formatContextVerse(bible: BibleData, pointer: VersePointer): string | undefined {
  const verse = getVerseData(bible, pointer);
  if (!verse) return undefined;
  return `${verse.reference} ${verse.text}`.trim();
}

function findAdjacentBook(currentOsis: string, step: 1 | -1): string | undefined {
  const currentOrder = BOOK_ORDER.get(currentOsis);
  if (currentOrder === undefined) return undefined;
  const adjacentIndex = currentOrder + step;
  if (adjacentIndex < 0 || adjacentIndex >= BOOK_OSIS_BY_NUMBER.length) {
    return undefined;
  }
  return BOOK_OSIS_BY_NUMBER[adjacentIndex] || undefined;
}

function comparePointers(a: VersePointer, b: VersePointer): number {
  if (a.bookOsis !== b.bookOsis) {
    const aOrder = BOOK_ORDER.get(a.bookOsis) ?? 0;
    const bOrder = BOOK_ORDER.get(b.bookOsis) ?? 0;
    return aOrder - bOrder;
  }
  if (a.chapter !== b.chapter) {
    return a.chapter - b.chapter;
  }
  return a.verse - b.verse;
}

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function extractVerseText(node: unknown): string {
  if (typeof node === "string") {
    return node.trim();
  }
  if (!node || typeof node !== "object") {
    return "";
  }

  const record = node as Record<string, unknown>;
  const segments: string[] = [];

  if (typeof record["#text"] === "string") {
    segments.push(record["#text"].trim());
  }

  for (const [key, value] of Object.entries(record)) {
    if (key === "#text" || key === "vnumber" || key === "n") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        const text = extractVerseText(item);
        if (text) segments.push(text);
      }
    } else {
      const text = extractVerseText(value);
      if (text) segments.push(text);
    }
  }

  return segments.join(" ").trim();
}

function toInteger(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : undefined;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

interface SerializedVerseData {
  reference: string;
  text: string;
}

interface SerializedChapterData {
  verses: Record<string, SerializedVerseData>;
  verseNumbers: number[];
}

interface SerializedBookData {
  name: string;
  osis: string;
  order: number;
  chapterNumbers: number[];
  chapters: Record<string, SerializedChapterData>;
}

interface SerializedBibleData {
  translation: TranslationConfig;
  books: Record<string, SerializedBookData>;
}

function serializeBibleData(bible: BibleData): SerializedBibleData {
  const books: Record<string, SerializedBookData> = {};

  for (const [bookOsis, book] of bible.books) {
    const chapters: Record<string, SerializedChapterData> = {};

    for (const [chapterNumber, chapter] of book.chapters) {
      const verses: Record<string, SerializedVerseData> = {};
      for (const [verseNumber, verse] of chapter.verses) {
        verses[String(verseNumber)] = {
          reference: verse.reference,
          text: verse.text,
        } satisfies SerializedVerseData;
      }

      chapters[String(chapterNumber)] = {
        verses,
        verseNumbers: [...chapter.verseNumbers],
      } satisfies SerializedChapterData;
    }

    books[bookOsis] = {
      name: book.name,
      osis: book.osis,
      order: book.order,
      chapterNumbers: [...book.chapterNumbers],
      chapters,
    } satisfies SerializedBookData;
  }

  return {
    translation: bible.translation,
    books,
  } satisfies SerializedBibleData;
}

function deserializeBibleData(payload: SerializedBibleData): BibleData | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const books = new Map<string, BookData>();
  for (const [bookOsis, book] of Object.entries(payload.books ?? {})) {
    if (!book) continue;
    const chapters = new Map<number, ChapterData>();

    for (const [chapterKey, chapter] of Object.entries(book.chapters ?? {})) {
      if (!chapter) continue;
      const chapterNumber = Number.parseInt(chapterKey, 10);
      if (!Number.isInteger(chapterNumber)) continue;

      const verses = new Map<number, VerseData>();
      for (const [verseKey, verse] of Object.entries(chapter.verses ?? {})) {
        if (!verse) continue;
        const verseNumber = Number.parseInt(verseKey, 10);
        if (!Number.isInteger(verseNumber)) continue;
        verses.set(verseNumber, {
          reference: verse.reference,
          text: verse.text,
        });
      }

      const verseNumbers = Array.isArray(chapter.verseNumbers) && chapter.verseNumbers.length > 0
        ? [...chapter.verseNumbers]
        : Array.from(verses.keys()).sort((a, b) => a - b);

      if (verseNumbers.length === 0) continue;

      chapters.set(chapterNumber, {
        verses,
        verseNumbers,
      });
    }

    const chapterNumbers = Array.isArray(book.chapterNumbers) && book.chapterNumbers.length > 0
      ? [...book.chapterNumbers]
      : Array.from(chapters.keys()).sort((a, b) => a - b);

    if (chapterNumbers.length === 0) continue;

    books.set(bookOsis, {
      name: book.name ?? bookOsis,
      osis: book.osis ?? bookOsis,
      order: typeof book.order === "number" ? book.order : BOOK_ORDER.get(bookOsis) ?? Number.MAX_SAFE_INTEGER,
      chapterNumbers,
      chapters,
    });
  }

  if (books.size === 0) {
    return null;
  }

  return {
    translation: payload.translation,
    books,
  } satisfies BibleData;
}

function pickProperty<T>(record: Record<string, unknown>, keys: string[]): T | undefined {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) continue;
    const value = record[key];
    if (value !== undefined) {
      return value as T;
    }
  }
  return undefined;
}

function pickString(record: Record<string, unknown>, keys: string[]): string | undefined {
  const candidate = pickProperty<unknown>(record, keys);
  return typeof candidate === "string" ? candidate.trim() : undefined;
}

function resolveBookOsis(record: Record<string, unknown>, fallbackNumber: number): string | undefined {
  const direct = pickString(record, ["osis", "OSIS", "osisid", "OSISID", "id", "ID"]);
  if (direct) {
    const normalized = direct.replace(/\s+/g, "");
    const upper = normalized.toUpperCase();
    const canonical = BOOK_OSIS_CANONICAL.get(upper) ?? BOOK_OSIS_CANONICAL.get(upper.replace(/\./g, ""));
    if (canonical) {
      return canonical;
    }
  }

  const fallback = BOOK_OSIS_BY_NUMBER[fallbackNumber];
  if (fallback) {
    return fallback;
  }

  const inferredByName = pickString(record, ["bname", "name", "n", "title"]);
  if (!inferredByName) {
    return undefined;
  }

  const upperName = inferredByName.replace(/\s+/g, "").toUpperCase();
  return BOOK_OSIS_CANONICAL.get(upperName);
}

export type { FetchBatchPassageArgs, FetchPassageArgs, PassageText, SerializedBibleData };
export { serializeBibleData, deserializeBibleData };
