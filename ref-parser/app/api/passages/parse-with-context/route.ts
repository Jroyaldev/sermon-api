import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { parsePassagesWithContext } from "@/lib/passages/parse";

const parseWithContextSchema = z.object({
  text: z.string().min(1, "text is required"),
  context: z.string().min(1, "context is required"),
  language: z.string().optional(),
  options: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const result = parseWithContextSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: result.error.flatten() },
      { status: 400 },
    );
  }

  const data = await parsePassagesWithContext(result.data);

  return NextResponse.json(data);
}
