const SUPPORTED_LANGS = new Set([
    "en",
]);
export async function loadLanguage(code) {
    if (!SUPPORTED_LANGS.has(code)) {
        throw new Error(`Unsupported language: ${code}`);
    }
    return import(`bible-passage-reference-parser/esm/lang/${code}.js`);
}
export function listLanguages() {
    return Array.from(SUPPORTED_LANGS.values());
}
//# sourceMappingURL=translations.js.map