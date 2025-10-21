import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT = 100;
const WINDOW_MS = 60_000;

const hits = new Map<string, { count: number; expires: number }>();

export function middleware(request: NextRequest) {
  const key = request.ip ?? "anonymous";
  const now = Date.now();
  const entry = hits.get(key);

  if (entry && entry.expires > now) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    entry.count += 1;
  } else {
    hits.set(key, { count: 1, expires: now + WINDOW_MS });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/passages/:path*"],
};
