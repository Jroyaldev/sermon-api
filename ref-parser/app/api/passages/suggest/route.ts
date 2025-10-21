import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { parsePassages } from "@/lib/passages/parse";
import { listLanguages } from "@/lib/passages/translations";

const schema = z.object({
  query: z.string().min(1, "query is required"),
  language: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: result.error.flatten() },
      { status: 400 },
    );
  }

  const { query, language } = result.data;
  const languages = language ? [language] : listLanguages();

  const suggestions = await Promise.all(
    languages.map(async (lang) => {
      const parsed = await parsePassages({ text: query, language: lang });
      return parsed.references.map((ref) => ({
        osis: ref.osis,
        language: lang,
        label: ref.osis,
      }));
    }),
  );

  return NextResponse.json({ suggestions: suggestions.flat() });
}
