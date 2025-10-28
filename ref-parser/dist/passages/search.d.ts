interface SearchArgs {
    query: string;
    language?: string;
}
interface SearchResult {
    references: {
        osis: string;
        snippet: string;
    }[];
}
export declare function searchPassages(args: SearchArgs): Promise<SearchResult>;
export {};
//# sourceMappingURL=search.d.ts.map