import { describe, expect, it } from "vitest";

import { GET as booksGET } from "@/app/api/passages/books/route";
import { POST as highlightPOST } from "@/app/api/passages/highlight/route";
import { POST as normalizePOST } from "@/app/api/passages/normalize/route";
import { POST as parsePOST } from "@/app/api/passages/parse/route";
import { POST as parseContextPOST } from "@/app/api/passages/parse-with-context/route";
import { GET as searchGET } from "@/app/api/passages/search/route";
import { GET as suggestGET } from "@/app/api/passages/suggest/route";
import { GET as textGET } from "@/app/api/passages/text/[osis]/route";

async function jsonResponse(response: Response) {
  const body = await response.json();
  return { status: response.status, body } as const;
}

describe("Passage API endpoints", () => {
  describe("parse ranges", () => {
    it("parses multiple references with ranges", async () => {
      const request = new Request("http://localhost/api/passages/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "John 3:16; Romans 8:28-30" }),
      });
      const response = await parsePOST(request as any);
      const { status, body } = await jsonResponse(response);

      expect(status).toBe(200);
      expect(body.rawOsis).toBe("John.3.16,Rom.8.28-Rom.8.30");
      expect(body.rawOsisWithTranslations).toEqual([
        ["John.3.16,Rom.8.28-Rom.8.30", ""],
      ]);
      expect(body.references.some((ref: any) => ref.osis.includes("John.3.16"))).toBeTruthy();
    });

    it("parses chained references and captures ranges", async () => {
      const payload = {
        text: "1 John 1:1-3, 2:4-5; Jude 1-2",
      };
      const request = new Request("http://localhost/api/passages/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const response = await parsePOST(request as any);
      const { status, body } = await jsonResponse(response);

      expect(status).toBe(200);
      expect(body.rawOsis).toContain("1John.1.1-1John.1.3");
      expect(body.rawOsis).toContain("1John.2.4-1John.2.5");
      expect(body.rawOsis).toContain("Jude.1.1-Jude.1.2");
    });
  });

  it("parses partial references with context", async () => {
    const request = new Request("http://localhost/api/passages/parse-with-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "verse 2", context: "Genesis 3" }),
    });
    const response = await parseContextPOST(request as any);
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.rawOsis).toContain("Gen.3.2");
  });

  it("normalizes references", async () => {
    const request = new Request("http://localhost/api/passages/normalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Psalm 23" }),
    });
    const response = await normalizePOST(request as any);
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.rawOsis).toContain("Ps.23");
  });

  it("provides language list", async () => {
    const response = await booksGET();
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.languages).toContain("en");
  });

  it("suggests references", async () => {
    const response = await suggestGET(new Request("http://localhost/api/passages/suggest?query=jn%203%2016"));
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.suggestions.some((item: any) => item.osis.startsWith("John.3.16"))).toBeTruthy();
  });

  it("searches passages", async () => {
    const response = await searchGET(new Request("http://localhost/api/passages/search?query=Romans%208"));
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.references.length).toBeGreaterThan(0);
  });

  it("highlights references", async () => {
    const request = new Request("http://localhost/api/passages/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "We love John 3:16" }),
    });
    const response = await highlightPOST(request as any);
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.html).toContain("<mark>John 3:16</mark>");
    expect(body).toMatchObject({
      references: [expect.objectContaining({ osis: "John.3.16" })],
    });
  });

  it("supports custom highlight markers", async () => {
    const request = new Request("http://localhost/api/passages/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "See John 1:1", markStart: "<span class=\"match\">", markEnd: "</span>" }),
    });
    const response = await highlightPOST(request as any);
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.html).toContain('<span class="match">John 1:1</span>');
  });

  it("returns passage text", async () => {
    const request = new Request("http://localhost/api/passages/text/John.3.16");
    (request as any).nextUrl = new URL("http://localhost/api/passages/text/John.3.16");
    const response = await textGET(request as any, {
      params: { osis: "John.3.16" },
    } as any);
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(200);
    expect(body.osis).toBe("John.3.16");
    expect(body.verses[0]?.text).toContain("For God so loved the world");
  });

  it("rejects invalid parse payloads", async () => {
    const request = new Request("http://localhost/api/passages/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await parsePOST(request as any);
    const { status, body } = await jsonResponse(response);

    expect(status).toBe(400);
    expect(body).toMatchObject({ error: "Invalid request" });
  });
});
