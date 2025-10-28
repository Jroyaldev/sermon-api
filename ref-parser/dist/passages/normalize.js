import { getParser } from "./parser-registry";
export async function normalizeReference(input) {
    const parser = await getParser(input.language);
    parser.parse(input.text);
    return {
        references: parser.osis_and_indices().map((entity) => ({
            osis: entity.osis,
            translations: entity.translations,
            indices: [entity.indices[0] ?? -1, entity.indices[1] ?? -1],
        })),
        rawOsis: parser.osis(),
        rawOsisWithTranslations: parser.osis_and_translations(),
    };
}
//# sourceMappingURL=normalize.js.map