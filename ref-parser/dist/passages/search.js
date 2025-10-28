import { parsePassages } from "./parse";
export async function searchPassages(args) {
    const parsed = await parsePassages({ text: args.query, language: args.language });
    return {
        references: parsed.references.map((ref) => ({
            osis: ref.osis,
            snippet: args.query,
        })),
    };
}
//# sourceMappingURL=search.js.map