import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { fetchPassageText } from "@/lib/passages/text-service";

const querySchema = z.object({
  translation: z.string().optional(),
  includeContext: z.coerce.boolean().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { osis: string } }) {
  const result = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: result.error.flatten() },
      { status: 400 },
    );
  }

  const data = await fetchPassageText({
    osis: decodeURIComponent(params.osis),
    translation: result.data.translation,
    includeContext: result.data.includeContext ?? false,
  });

  if (!data) {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
