export interface TranslationConfig {
    id: string;
    label: string;
    file: string;
    isDefault?: boolean;
}
export declare const TRANSLATIONS: Map<string, TranslationConfig>;
export declare function getDefaultTranslation(): TranslationConfig;
export declare function resolveTranslation(id?: string): TranslationConfig | undefined;
export interface TranslationSummary {
    id: string;
    label: string;
    isDefault: boolean;
}
export declare function listTranslations(): TranslationSummary[];
export declare function listTranslationConfigs(): TranslationConfig[];
//# sourceMappingURL=translation-metadata.d.ts.map