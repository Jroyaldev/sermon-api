import { type TranslationConfig } from "./translation-metadata";
interface FetchPassageArgs {
    osis: string;
    translation?: string;
    includeContext: boolean;
}
interface PassageText {
    osis: string;
    translation: string;
    translationId: string;
    verses: {
        reference: string;
        text: string;
    }[];
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
export declare function fetchPassageText(args: FetchPassageArgs): Promise<PassageText | null>;
export declare function fetchBatchPassageText(args: FetchBatchPassageArgs): Promise<(PassageText | null)[]>;
export declare function parseBibleFromXml(translation: TranslationConfig): Promise<BibleData | null>;
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
declare function serializeBibleData(bible: BibleData): SerializedBibleData;
declare function deserializeBibleData(payload: SerializedBibleData): BibleData | null;
export type { FetchBatchPassageArgs, FetchPassageArgs, PassageText, SerializedBibleData };
export { serializeBibleData, deserializeBibleData };
//# sourceMappingURL=text-service.d.ts.map