import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/components/**"],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 90 },
    },
  },
});
