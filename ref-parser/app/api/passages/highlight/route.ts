import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { highlightReferences } from "@/lib/passages/highlight";

const schema = z.object({
  text: z.string().min(1, "text is required"),
  language: z.string().optional(),
  markStart: z.string().optional(),
  markEnd: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: result.error.flatten() },
      { status: 400 },
    );
  }

  const data = await highlightReferences(result.data);
  return NextResponse.json(data);
}
