import { NextResponse } from "next/server";

import { listTranslations } from "@/lib/passages/translation-metadata";

export async function GET() {
  const translations = listTranslations();
  return NextResponse.json({ translations });
}
