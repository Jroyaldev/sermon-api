import { parsePassages } from "./parse";

interface HighlightInput {
  text: string;
  language?: string;
  markStart?: string;
  markEnd?: string;
}

interface HighlightResult {
  html: string;
  references: {
    osis: string;
    start: number;
    end: number;
  }[];
}

export async function highlightReferences(input: HighlightInput): Promise<HighlightResult> {
  const { text, language, markStart = "<mark>", markEnd = "</mark>" } = input;
  const parsed = await parsePassages({ text, language });

  let offset = 0;
  let html = text;
  const references = [] as HighlightResult["references"];

  for (const ref of parsed.references) {
    const [start, end] = ref.indices;
    if (start < 0 || end < 0) continue;
    const actualStart = start + offset;
    const actualEnd = end + offset;
    html = `${html.slice(0, actualStart)}${markStart}${html.slice(actualStart, actualEnd)}${markEnd}${html.slice(actualEnd)}`;
    offset += markStart.length + markEnd.length;
    references.push({ osis: ref.osis, start, end });
  }

  return { html, references };
}
