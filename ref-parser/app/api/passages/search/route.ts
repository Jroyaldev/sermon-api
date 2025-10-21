import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { searchPassages } from "@/lib/passages/search";

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
      { error: "Invalid query", issues: result.error.flatten() },
      { status: 400 },
    );
  }

  const data = await searchPassages(result.data);
  return NextResponse.json(data);
}
