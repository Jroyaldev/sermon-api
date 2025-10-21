import { parsePassages } from "./parse";

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

export async function searchPassages(args: SearchArgs): Promise<SearchResult> {
  const parsed = await parsePassages({ text: args.query, language: args.language });
  return {
    references: parsed.references.map((ref) => ({
      osis: ref.osis,
      snippet: args.query,
    })),
  };
}
