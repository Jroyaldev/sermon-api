import { NextRequest, NextResponse } from "next/server";

import { parsePassages } from "@/lib/passages/parse";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.text !== "string" || body.text.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid request", issues: { text: ["text is required"] } },
      { status: 400 },
    );
  }

  const data = await parsePassages({
    text: body.text,
    language: typeof body.language === "string" ? body.language : undefined,
    options: typeof body.options === "object" && body.options !== null ? body.options : undefined,
  });

  return NextResponse.json(data);
}
