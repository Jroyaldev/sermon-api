import { NextResponse } from "next/server";

import { listLanguages } from "@/lib/passages/translations";

export async function GET() {
  const languages = listLanguages();
  return NextResponse.json({ languages });
}
