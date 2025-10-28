// Client-safe exports (no file I/O, can run in browser)
export { parsePassages, parsePassagesWithContext } from "./parse";
export { normalizeReference } from "./normalize";
export { searchPassages } from "./search";
export { listLanguages } from "./translations";
// Server-only exports (requires file I/O, use from server actions only)
export { fetchPassageText, fetchBatchPassageText, parseBibleFromXml, serializeBibleData, } from "./text-service";
export { getDefaultTranslation, resolveTranslation, listTranslations, listTranslationConfigs, TRANSLATIONS, } from "./translation-metadata";
// Imports for use within this file
import { listLanguages } from "./translations";
import { parsePassages } from "./parse";
export async function suggestReferences(query, language) {
    const languages = language ? [language] : listLanguages();
    const suggestions = await Promise.all(languages.map(async (lang) => {
        const parsed = await parsePassages({ text: query, language: lang });
        return parsed.references.map((ref) => ({
            osis: ref.osis,
            language: lang,
            label: ref.osis,
        }));
    }));
    return { suggestions: suggestions.flat() };
}
//# sourceMappingURL=index.js.map