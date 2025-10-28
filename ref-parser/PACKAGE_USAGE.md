# sermon-api Package Usage

This package provides Bible passage parsing, reference handling, and text fetching functionality for both client and server environments.

## Building the Package

Before using the package, build it:

```bash
npm run build:lib
```

This compiles the TypeScript source files to JavaScript in the `dist/` directory.

## Package Structure

The package provides three entry points:

- `sermon-api/lib` - Main entry point with all exports
- `sermon-api/lib/client` - Client-safe exports (no file I/O, browser-compatible)
- `sermon-api/lib/server` - Server-only exports (requires Node.js file system access)

### Client Entry Point (`sermon-api/lib/client`)

Client-safe functions that can run in the browser:

```typescript
import {
  parsePassages,
  parsePassagesWithContext,
  normalizeReference,
  searchPassages,
  listLanguages,
  suggestReferences,
  type ParseInput,
  type ParsedReference,
  type ParseResult,
} from "sermon-api/lib/client";
```

**Available Functions:**
- `parsePassages(input)` - Parse Bible references from text
- `parsePassagesWithContext(input)` - Parse with surrounding context
- `normalizeReference(reference)` - Normalize reference format
- `searchPassages(query)` - Search for passages
- `listLanguages()` - List available parsing languages
- `suggestReferences(query, language?)` - Get reference suggestions

### Server Entry Point (`sermon-api/lib/server`)

Server-only functions that require file system access (for loading Bible text data):

```typescript
import {
  fetchPassageText,
  fetchBatchPassageText,
  getDefaultTranslation,
  resolveTranslation,
  listTranslations,
  type TranslationConfig,
  type TranslationSummary,
} from "sermon-api/lib/server";
```

**Available Functions:**
- `fetchPassageText(args)` - Fetch text for a single passage
- `fetchBatchPassageText(args)` - Fetch text for multiple passages
- `listTranslations()` - List available Bible translations
- `getDefaultTranslation()` - Get default translation config
- `resolveTranslation(id?)` - Resolve translation by ID

## Installing in Your Next.js App

### Option 1: Local File Dependency (Recommended for Monorepo)

In your Next.js app's `package.json`:

```json
{
  "dependencies": {
    "sermon-api": "file:../sermon-api/ref-parser"
  }
}
```

Then run:
```bash
npm install
```

### Option 2: npm link (For Local Development)

In the sermon-api directory:
```bash
npm link
```

In your Next.js app directory:
```bash
npm link sermon-api
```

## Data Files

The package includes pre-compiled Bible translation data in `data/bibles-compiled/`:
- AMP.json (Amplified Bible)
- ESV.json (English Standard Version)
- MSG.json (The Message)
- NASB.json (New American Standard Bible)
- NIV.json (New International Version)
- NKJV.json (New King James Version)
- NLT.json (New Living Translation)

And footnotes data in `data/footnotes/footnotes.jsonl`.

These files are automatically included when the package is installed.

## Usage Examples

### Client-Side (React Component)

```typescript
"use client";

import { parsePassages, suggestReferences } from "sermon-api/lib/client";
import { useState } from "react";

export function ScriptureParser() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleParse = async () => {
    const parsed = await parsePassages({ text: input, language: "en" });
    setResults(parsed.references);
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleParse}>Parse</button>
      {/* Display results */}
    </div>
  );
}
```

### Server-Side (Server Action or API Route)

```typescript
"use server";

import { fetchPassageText } from "sermon-api/lib/server";

export async function fetchVerse(osis: string, translation?: string) {
  const passage = await fetchPassageText({
    osis,
    translation,
    includeContext: true,
  });

  return passage;
}
```

## Deployment to Vercel

The package works automatically on Vercel when installed as a dependency. The build process:

1. Ensures `npm run build:lib` has been run before pushing
2. Commits the `dist/` directory (note: it's in `.gitignore` by default, so you may need to force add it or remove from `.gitignore`)
3. Vercel will install the package and use the built files

Alternatively, you can add a build hook in your Next.js app to build the package:

```json
{
  "scripts": {
    "prebuild": "cd ../sermon-api/ref-parser && npm run build:lib",
    "build": "next build"
  }
}
```

## Troubleshooting

### Module not found errors

If you see "Module not found: Can't resolve 'sermon-api/lib/client'":

1. Ensure the package is built: `npm run build:lib`
2. Verify the `dist/` directory exists and contains the compiled files
3. Check your package.json has the correct dependency reference
4. Run `npm install` to reinstall the package

### Data files not found

If you see errors about missing Bible data files:

1. Verify `data/bibles-compiled/` contains .json files
2. Check the package's `files` field in package.json includes the data directories
3. The package uses relative paths from the built files to find data

## Development

When making changes to the package:

1. Make your changes in `lib/`
2. Run `npm run build:lib` to rebuild
3. Test in your consuming app
4. Commit changes including the rebuilt `dist/` directory
