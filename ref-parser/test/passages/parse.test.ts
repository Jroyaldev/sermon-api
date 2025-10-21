import { describe, expect, it } from "vitest";

import { parsePassages } from "@/lib/passages/parse";

describe("parsePassages", () => {
  it("parses simple reference", async () => {
    const result = await parsePassages({ text: "John 3:16" });
    expect(result.rawOsis).toContain("John.3.16");
    expect(result.references[0]?.indices[0]).toBeGreaterThanOrEqual(0);
  });
});
