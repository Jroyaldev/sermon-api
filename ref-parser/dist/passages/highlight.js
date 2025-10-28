import { parsePassages } from "./parse";
export async function highlightReferences(input) {
    const { text, language, markStart = "<mark>", markEnd = "</mark>" } = input;
    const parsed = await parsePassages({ text, language });
    let offset = 0;
    let html = text;
    const references = [];
    for (const ref of parsed.references) {
        const [start, end] = ref.indices;
        if (start < 0 || end < 0)
            continue;
        const actualStart = start + offset;
        const actualEnd = end + offset;
        html = `${html.slice(0, actualStart)}${markStart}${html.slice(actualStart, actualEnd)}${markEnd}${html.slice(actualEnd)}`;
        offset += markStart.length + markEnd.length;
        references.push({ osis: ref.osis, start, end });
    }
    return { html, references };
}
//# sourceMappingURL=highlight.js.map