import { defineConfig, devices } from '@playwright/test';

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ...(process.platform === 'win32' && !process.env.CI
    ? []
    : [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }]),
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Firefox's Windows binary requires a system runtime that is not present on every Windows machine.
  // Keep it in CI's full cross-browser matrix while keeping the default local Windows run reliable.
  projects,
  webServer: {
    command: 'node demo/server.js',
    url: 'http://127.0.0.1:4173/health',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
