export interface ParseInput {
  text: string;
  language?: string;
  options?: Record<string, unknown>;
}

export interface ParseWithContextInput extends ParseInput {
  context: string;
}

export interface ParsedReference {
  osis: string;
  indices: [number, number];
  translations: string[];
}

export interface ParseResult {
  references: ParsedReference[];
  rawOsis: string;
  rawOsisWithTranslations: string[][];
}

export type BCVParserInterface = {
  parse(input: string): BCVParserInterface;
  parse_with_context(input: string, context: string): BCVParserInterface;
  osis(): string;
  osis_and_translations(): string[][];
  osis_and_indices(): { osis: string; indices: number[]; translations: string[] }[];
  set_options(options: Record<string, unknown>): void;
};
