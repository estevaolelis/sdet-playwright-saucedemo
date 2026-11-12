import fs from "node:fs";
import { defineConfig, devices, chromium } from "@playwright/test";

const hasBundledChromium = fs.existsSync(chromium.executablePath());

const browserUse = {
  ...devices["Desktop Chrome"],
  ...(hasBundledChromium ? {} : { channel: "msedge" as const }),
};

export const STORAGE_STATE = "playwright/.auth/standard.json";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["blob"], ["allure-playwright"]] : [["html"], ["allure-playwright"]],
  use: {
    baseURL: "https://www.saucedemo.com",
    testIdAttribute: "data-test",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: browserUse,
    },

    {
      name: "chromium",
      use: { ...browserUse, storageState: STORAGE_STATE },
      dependencies: ["setup"],
      testIgnore: [/login\.spec\.ts/, /auth\.setup\.ts/],
    },

    {
      name: "chromium-login",
      use: browserUse,
      testMatch: /login\.spec\.ts/,
    },
  ],
});
