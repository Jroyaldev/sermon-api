import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { fetchBatchPassageText } from "@/lib/passages/text-service";

const bodySchema = z.object({
  references: z.array(z.string().min(1)).max(50),
  translation: z.string().optional(),
  includeContext: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const passages = await fetchBatchPassageText({
    references: parsed.data.references,
    translation: parsed.data.translation,
    includeContext: parsed.data.includeContext ?? false,
  });

  return NextResponse.json({ passages });
}
