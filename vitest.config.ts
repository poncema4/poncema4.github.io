import { defineConfig } from "vitest/config";
import path from "path";

// Vitest owns the unit tests only. The e2e specs are Playwright's — different runner,
// different assumptions — so they're excluded here or vitest tries to collect them.
export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    environment: "node",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
