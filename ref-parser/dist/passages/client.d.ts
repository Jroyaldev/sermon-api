export { parsePassages, parsePassagesWithContext } from "./parse";
export { normalizeReference } from "./normalize";
export { searchPassages } from "./search";
export { listLanguages } from "./translations";
export type { ParseInput, ParseWithContextInput, ParsedReference, ParseResult, } from "./types";
export interface SuggestionResult {
    osis: string;
    language: string;
    label: string;
}
export declare function suggestReferences(query: string, language?: string): Promise<{
    suggestions: SuggestionResult[];
}>;
//# sourceMappingURL=client.d.ts.map