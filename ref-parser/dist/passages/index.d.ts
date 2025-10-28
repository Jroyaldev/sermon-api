export { parsePassages, parsePassagesWithContext } from "./parse";
export { normalizeReference } from "./normalize";
export { searchPassages } from "./search";
export { listLanguages } from "./translations";
export { fetchPassageText, fetchBatchPassageText, parseBibleFromXml, serializeBibleData, } from "./text-service";
export { getDefaultTranslation, resolveTranslation, listTranslations, listTranslationConfigs, TRANSLATIONS, type TranslationConfig, type TranslationSummary, } from "./translation-metadata";
export type { ParseInput, ParseWithContextInput, ParsedReference, ParseResult, } from "./types";
export interface SuggestionResult {
    osis: string;
    language: string;
    label: string;
}
export declare function suggestReferences(query: string, language?: string): Promise<{
    suggestions: SuggestionResult[];
}>;
//# sourceMappingURL=index.d.ts.map