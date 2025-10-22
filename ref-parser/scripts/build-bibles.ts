import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import path from "node:path";

import { TRANSLATIONS } from "@/lib/passages/translation-metadata";
import { parseBibleFromXml, serializeBibleData } from "@/lib/passages/text-service";

const OUTPUT_DIRECTORY = path.join(process.cwd(), "data", "bibles-compiled");

async function buildBibles() {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });

  let successCount = 0;
  const translations = Array.from(TRANSLATIONS.values());

  for (const translation of translations) {
    const start = performance.now();
    try {
      const bible = await parseBibleFromXml(translation);
      if (!bible) {
        console.warn("Skipping translation with no data", { translation: translation.id });
        continue;
      }

      const serialized = serializeBibleData(bible);
      const outputPath = path.join(OUTPUT_DIRECTORY, `${translation.id}.json`);
      await writeFile(outputPath, JSON.stringify(serialized));

      const duration = Math.round(performance.now() - start);
      console.info("Serialized bible translation", {
        translation: translation.id,
        durationMs: duration,
        books: bible.books.size,
        output: path.relative(process.cwd(), outputPath),
      });
      successCount += 1;
    } catch (error) {
      console.error("Failed to serialize translation", { translation: translation.id, error });
    }
  }

  console.info("Bible serialization complete", {
    completed: successCount,
    total: translations.length,
    outputDirectory: OUTPUT_DIRECTORY,
  });
}

void buildBibles().catch((error) => {
  console.error("build-bibles script failed", { error });
  process.exitCode = 1;
});
