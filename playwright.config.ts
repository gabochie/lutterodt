import { defineConfig, devices } from "@playwright/test";

const LOCAL_PORT = 3210;
const LOCAL_URL = `http://localhost:${LOCAL_PORT}`;
const PROD_URL = "https://lutterodt.org";

const smokeOnly = process.argv.some(
  (arg) => arg === "--project=smoke" || arg.includes("project=smoke")
);

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    ...(smokeOnly
      ? []
      : [
          {
            name: "chromium",
            use: {
              ...devices["Desktop Chrome"],
              baseURL: LOCAL_URL,
            },
          },
          {
            name: "firefox-smoke",
            testMatch: /routes\.smoke\.spec\.ts$/,
            use: {
              ...devices["Desktop Firefox"],
              baseURL: LOCAL_URL,
            },
          },
        ]),
    {
      name: "smoke",
      testMatch: /smoke\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: PROD_URL,
      },
    },
  ],
  webServer: smokeOnly
    ? undefined
    : {
        command: `npm run build && npx next start --port ${LOCAL_PORT}`,
        url: LOCAL_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
        env: {
          NEXT_PUBLIC_SITE_URL: LOCAL_URL,
          ADMIN_PASSWORD: "e2e-local-admin-password",
          AUTH_SECRET:
            "e2e-local-auth-secret-value-at-least-32-characters-long",
          CRON_SECRET: "e2e-local-cron-secret",
        },
      },
});
