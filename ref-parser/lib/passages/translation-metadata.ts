export interface TranslationConfig {
  id: string;
  label: string;
  file: string;
  isDefault?: boolean;
}

const TRANSLATION_LIST: TranslationConfig[] = [
  { id: "ESV", label: "English Standard Version", file: "esv.xml", isDefault: true },
  { id: "NASB", label: "New American Standard Bible", file: "Bible_English_NASB_Strong.xml" },
  { id: "NKJV", label: "New King James Version", file: "Bible_English_NKJV.xml" },
  { id: "NIV", label: "New International Version", file: "NIV.xml" },
  { id: "NLT", label: "New Living Translation", file: "NLT.xml" },
  { id: "AMP", label: "Amplified Bible (Classic)", file: "AMP_Classic.xml" },
  { id: "MSG", label: "The Message", file: "MSG.xml" },
];

export const TRANSLATIONS = new Map<string, TranslationConfig>(
  TRANSLATION_LIST.map((translation) => [translation.id, translation]),
);

export function getDefaultTranslation(): TranslationConfig {
  const defaultEntry = TRANSLATION_LIST.find((translation) => translation.isDefault);
  return defaultEntry ?? TRANSLATION_LIST[0];
}

export function resolveTranslation(id?: string): TranslationConfig | undefined {
  if (!id) {
    return getDefaultTranslation();
  }

  const normalized = id.trim().toUpperCase();
  return TRANSLATIONS.get(normalized) ?? getDefaultTranslation();
}

export interface TranslationSummary {
  id: string;
  label: string;
  isDefault: boolean;
}

export function listTranslations(): TranslationSummary[] {
  return TRANSLATION_LIST.map((translation) => ({
    id: translation.id,
    label: translation.label,
    isDefault: translation.isDefault ?? false,
  }));
}

export function listTranslationConfigs(): TranslationConfig[] {
  return [...TRANSLATION_LIST];
}
