# Integration Guide: Using sermon-api in Your Next.js App

## What Was Fixed

The sermon-api package now:
- ✅ Builds to JavaScript files that can be consumed by Next.js
- ✅ Exports separate client and server entry points
- ✅ Includes all Bible data files (7 translations + footnotes)
- ✅ Works on Vercel and in local development

## Setup Steps

### 1. In the sermon-api/ref-parser directory

The package is already built and ready. If you make changes, rebuild with:

```bash
cd /path/to/sermon-api/ref-parser
npm run build:lib
```

### 2. In your Next.js app (pastor project)

Update your `package.json`:

```json
{
  "dependencies": {
    "sermon-api": "file:../sermon-api/ref-parser"
  }
}
```

Then install:

```bash
npm install
```

### 3. Update your imports

**In client components** (files with `"use client"`):

```typescript
// Before (relative path - won't work on Vercel):
import { parsePassages } from "../../../sermon-api/lib/passages/client";

// After (package import - works everywhere):
import { parsePassages } from "sermon-api/lib/client";
```

**In server components, actions, or API routes**:

```typescript
// Before:
import { fetchPassageText } from "../../../sermon-api/lib/passages/server";

// After:
import { fetchPassageText } from "sermon-api/lib/server";
```

### 4. Available Imports

#### Client Entry (`sermon-api/lib/client`)
Safe to use in browser/React components:

```typescript
import {
  parsePassages,
  parsePassagesWithContext,
  normalizeReference,
  searchPassages,
  listLanguages,
  suggestReferences,
  // Types:
  type ParseInput,
  type ParsedReference,
  type ParseResult,
  type SuggestionResult,
} from "sermon-api/lib/client";
```

#### Server Entry (`sermon-api/lib/server`)
Server-only (requires Node.js file system):

```typescript
import {
  fetchPassageText,
  fetchBatchPassageText,
  getDefaultTranslation,
  resolveTranslation,
  listTranslations,
  // Types:
  type TranslationConfig,
  type TranslationSummary,
} from "sermon-api/lib/server";
```

## Example: Fixing Your Current Error

Based on the error message, update this file:

**File:** `src/lib/scripture/ref-parser-client.ts`

```typescript
// ❌ Before (relative path):
import {
  parsePassages as parsePassagesLib,
  suggestReferences as suggestReferencesLib,
} from "../../../sermon-api/lib/passages/client";

// ✅ After (package import):
import {
  parsePassages as parsePassagesLib,
  suggestReferences as suggestReferencesLib,
} from "sermon-api/lib/client";
```

**File:** `src/lib/scripture/server-actions.ts`

```typescript
// ❌ Before:
import { fetchPassageText } from "../../../sermon-api/lib/passages/server";

// ✅ After:
import { fetchPassageText } from "sermon-api/lib/server";
```

## Vercel Deployment

### Option 1: Commit dist/ (Recommended)

The dist/ directory is now tracked by git. Just commit and push:

```bash
git add .
git commit -m "feat: configure sermon-api package for consumption"
git push
```

Vercel will automatically install the package from the relative path.

### Option 2: Build during deployment

If you prefer not to commit dist/, add a prebuild script to your Next.js app's package.json:

```json
{
  "scripts": {
    "prebuild": "cd ../sermon-api/ref-parser && npm ci && npm run build:lib",
    "build": "next build"
  }
}
```

## Testing Locally

1. Install the package: `npm install`
2. Update your imports as shown above
3. Run your dev server: `npm run dev`
4. Verify no "Module not found" errors

## Data Files

The package includes ~39MB of Bible translation data:
- 7 pre-compiled Bible translations (ESV, NIV, NASB, NKJV, NLT, MSG, AMP)
- Footnotes data

These are automatically included and accessible to the server-side functions.

## Troubleshooting

### "Module not found: Can't resolve 'sermon-api/lib/client'"

1. Ensure sermon-api is built: `cd ../sermon-api/ref-parser && npm run build:lib`
2. Reinstall in your app: `npm install`
3. Check package.json has: `"sermon-api": "file:../sermon-api/ref-parser"`

### "Cannot find module" for data files

The package handles data file paths automatically using relative imports from the built location. No additional configuration needed.

### TypeScript errors

If TypeScript can't find types, add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node"
  }
}
```

## Next Steps

1. Run `npm install` in your Next.js app
2. Update all imports from relative paths to package imports
3. Test locally
4. Commit changes
5. Deploy to Vercel

The package is ready to use! 🎉
