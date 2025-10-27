// Client-safe exports only (no file I/O, can run in browser)
export { parsePassages, parsePassagesWithContext } from "./parse";
export { normalizeReference } from "./normalize";
export { searchPassages } from "./search";
export { listLanguages } from "./translations";

// Import for use within this file
import { listLanguages } from "./translations";
import { parsePassages } from "./parse";

// Re-export types
export type {
  ParseInput,
  ParseWithContextInput,
  ParsedReference,
  ParseResult,
} from "./types";

// Client-safe suggestion helper
export interface SuggestionResult {
  osis: string;
  language: string;
  label: string;
}

export async function suggestReferences(
  query: string,
  language?: string,
): Promise<{ suggestions: SuggestionResult[] }> {
  const languages = language ? [language] : listLanguages();

  const suggestions = await Promise.all(
    languages.map(async (lang) => {
      const parsed = await parsePassages({ text: query, language: lang });
      return parsed.references.map((ref) => ({
        osis: ref.osis,
        language: lang,
        label: ref.osis,
      }));
    }),
  );

  return { suggestions: suggestions.flat() };
}
