import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // auth.ts imports next/headers (edge-only); unit tests stub it.
      "next/headers": path.resolve(__dirname, "./test/unit/next-headers-stub.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["test/unit/**/*.test.ts"],
  },
});
