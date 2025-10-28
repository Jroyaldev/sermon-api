import { parsePassages } from "./parse";
import { listLanguages } from "./translations";

// Client-safe exports (no file I/O, can run in browser)
export { parsePassages, parsePassagesWithContext } from "./parse";
export { normalizeReference } from "./normalize";
export { searchPassages } from "./search";
export { listLanguages } from "./translations";

// Server-only exports (requires file I/O, use from server actions only)
export { fetchPassageText, fetchBatchPassageText } from "./text-service";
export {
  getDefaultTranslation,
  resolveTranslation,
  listTranslations,
  type TranslationConfig,
  type TranslationSummary,
} from "./translation-metadata";

// Re-export types
export type {
  ParseInput,
  ParseWithContextInput,
  ParsedReference,
  ParseResult,
} from "./types";

// Client-safe suggestion helper (mirrors the API endpoint logic)
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
