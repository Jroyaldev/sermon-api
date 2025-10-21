import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
  },
});
