# Ref Parser API – Engineering Guide

## Overview
`sermon-api/ref-parser` is a Next.js API-only service that exposes Bible passage utilities for the sermon editor. It wraps the `bible-passage-reference-parser` ESM bundle to identify, normalize, and highlight scripture references inside free-form text.

Key capabilities:
- Parse single/multiple ranges with tolerant matching (`POST /api/passages/parse`).
- Parse partial references using contextual passages (`POST /api/passages/parse-with-context`).
- Normalize references and provide OSIS metadata (`POST /api/passages/normalize`).
- Suggest likely references for fuzzy input (`GET /api/passages/suggest`).
- Provide placeholder passage text with optional context (`GET /api/passages/text/[osis]`).
- Highlight references inline (`POST /api/passages/highlight`).
- Offer search scaffolding and book language discovery (`GET /api/passages/search`, `/api/passages/books`).

## Local Development
```bash
cd sermon-api/ref-parser
npm install
npm run dev -- --port 3001  # choose free port if 3000 is used elsewhere
```

Manual testing (requires server running):
```bash
curl -s http://localhost:3001/api/health | jq
curl -s -X POST http://localhost:3001/api/passages/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"1 John 1:1-3, 2:4-5; Jude 1-2"}' | jq
```

Automated checks:
```bash
npm run lint
npm run test -- --reporter verbose
```

## Project Structure
- `app/api/**/route.ts`: Next.js App Router endpoints.
- `lib/passages/*`: Parser loader, normalization helpers, caching stubs.
- `test/passages/*.test.ts`: Vitest coverage for endpoints and parser utilities.

## Integration Notes
- Parser instances are cached per language; only English is enabled (`lib/passages/translations.ts`). Add languages by whitelisting additional modules.
- Rates are limited via in-memory middleware (`app/api/passages/parse/middleware.ts`) for defensive throttling; replace with Redis if multi-instance deployment is planned.
- `lib/passages/text-service.ts` currently returns placeholder data. Swap in your scripture content provider before production.
- All endpoints validate input with `zod` and return JSON errors (`{ error, issues }`).
- Use `/api/passages/highlight` or the `highlightReferences` helper for editor markup without duplicating parser logic client-side.

## Deployment Guidance
- This package targets Vercel serverless runtime. Ensure `node_modules` are installed during build (`npm ci`).
- Set `NEXT_RUNTIME=experimental-edge` only after confirming parser compatibility; default Node runtime is recommended.
- Provide environment variables (auth keys, scripture API URLs) via Vercel project settings.
- Warm parser cache by calling `/api/passages/parse` on cold start if necessary.

## Extending
- To add new endpoints, follow existing handler pattern (validate → invoke lib → return JSON).
- For collaborative sermon features, augment response objects (e.g., include matched book titles, verse counts) in `lib/passages/parse.ts`.
- Expand `lib/passages/translations.ts` with translation file imports once additional languages are needed.
