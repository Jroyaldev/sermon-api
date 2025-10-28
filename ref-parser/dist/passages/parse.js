import { getParser } from "./parser-registry";
function mapReferences(entities) {
    return entities.map((entity) => ({
        osis: entity.osis,
        translations: entity.translations,
        indices: [entity.indices[0] ?? -1, entity.indices[1] ?? -1],
    }));
}
export async function parsePassages(input) {
    const { text, language = "en", options } = input;
    const parser = await getParser(language, options);
    parser.parse(text);
    return buildResult(parser);
}
export async function parsePassagesWithContext(input) {
    const { text, context, language = "en", options } = input;
    const parser = await getParser(language, options);
    parser.parse_with_context(text, context);
    return buildResult(parser);
}
function buildResult(parser) {
    const references = mapReferences(parser.osis_and_indices());
    return {
        references,
        rawOsis: parser.osis(),
        rawOsisWithTranslations: parser.osis_and_translations(),
    };
}
//# sourceMappingURL=parse.js.map