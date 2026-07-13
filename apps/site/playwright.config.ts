import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:3100",
    // Emulate prefers-reduced-motion so the page-transition animation is
    // skipped: axe then scans the settled, full-opacity DOM (a mid-transition
    // opacity composite fails color-contrast).
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: {
    command: "pnpm dev --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
