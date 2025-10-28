interface HighlightInput {
    text: string;
    language?: string;
    markStart?: string;
    markEnd?: string;
}
interface HighlightResult {
    html: string;
    references: {
        osis: string;
        start: number;
        end: number;
    }[];
}
export declare function highlightReferences(input: HighlightInput): Promise<HighlightResult>;
export {};
//# sourceMappingURL=highlight.d.ts.map