import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    launchOptions: { executablePath },
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    {
      name: "development",
      testDir: "./tests/development",
      use: { baseURL: "http://127.0.0.1:3101", viewport: { width: 1280, height: 900 } }
    }
  ],
  webServer: [
    {
      command: "npm run start -- --port 3100",
      url: "http://127.0.0.1:3100/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
      env: { NEXT_TELEMETRY_DISABLED: "1" }
    },
    {
      command: "npm run dev -- --port 3101",
      url: "http://127.0.0.1:3101/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
      env: {
        NEXT_TELEMETRY_DISABLED: "1",
        INJESSUS_NEXT_DIST_DIR: ".next-preview-tests"
      }
    }
  ]
});
