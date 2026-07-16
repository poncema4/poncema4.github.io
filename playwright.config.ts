import { defineConfig, devices } from "@playwright/test";

// ponce-os e2e. Boots the real production build (not the dev server) so what we test
// is what Vercel ships. Desktop + mobile both run — the site has to work on a phone.
export default defineConfig({
  testDir: "./tests/e2e",
  // keep run artefacts inside tests/ instead of littering the repo root
  outputDir: "./tests/test-results",
  fullyParallel: false,        // the boot sequence + canvas games don't love contention
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "line" : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    video: "off",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Pixel 5 = Chromium-based mobile emulation (real touch + mobile viewport).
    // iPhone profiles need WebKit installed (`npx playwright install webkit`) — swap
    // back to devices["iPhone 13"] once/if that's downloaded, for real Safari coverage.
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],

  // build + serve the real thing, then test it
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
