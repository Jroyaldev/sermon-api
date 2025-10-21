import type { BCVParserInterface } from "./types";

import { loadLanguage } from "./translations";

const PARSER_CACHE = new Map<string, BCVParserInterface>();

export async function getParser(language = "en", options?: Record<string, unknown>): Promise<BCVParserInterface> {
  const cached = PARSER_CACHE.get(language);
  if (cached) {
    if (options) {
      cached.set_options(options);
    }
    return cached;
  }

  const langModule = await loadLanguage(language);
  const { bcv_parser } = await import("bible-passage-reference-parser/esm/bcv_parser.js");
  const parser: BCVParserInterface = new bcv_parser(langModule.default ?? langModule);
  if (options) {
    parser.set_options(options);
  }
  PARSER_CACHE.set(language, parser);
  return parser;
}
