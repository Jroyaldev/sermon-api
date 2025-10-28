const TRANSLATION_LIST = [
    { id: "ESV", label: "English Standard Version", file: "esv.xml", isDefault: true },
    { id: "NASB", label: "New American Standard Bible", file: "Bible_English_NASB_Strong.xml" },
    { id: "NKJV", label: "New King James Version", file: "Bible_English_NKJV.xml" },
    { id: "NIV", label: "New International Version", file: "NIV.xml" },
    { id: "NLT", label: "New Living Translation", file: "NLT.xml" },
    { id: "AMP", label: "Amplified Bible (Classic)", file: "AMP_Classic.xml" },
    { id: "MSG", label: "The Message", file: "MSG.xml" },
];
export const TRANSLATIONS = new Map(TRANSLATION_LIST.map((translation) => [translation.id, translation]));
export function getDefaultTranslation() {
    const defaultEntry = TRANSLATION_LIST.find((translation) => translation.isDefault);
    return defaultEntry ?? TRANSLATION_LIST[0];
}
export function resolveTranslation(id) {
    if (!id) {
        return getDefaultTranslation();
    }
    const normalized = id.trim().toUpperCase();
    return TRANSLATIONS.get(normalized) ?? getDefaultTranslation();
}
export function listTranslations() {
    return TRANSLATION_LIST.map((translation) => ({
        id: translation.id,
        label: translation.label,
        isDefault: translation.isDefault ?? false,
    }));
}
export function listTranslationConfigs() {
    return [...TRANSLATION_LIST];
}
//# sourceMappingURL=translation-metadata.js.map