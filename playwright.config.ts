import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { environment } from './config/environment';
import { authTestUsers } from './src/data/auth-test-users';
import type { FrameworkFixtures } from './src/fixtures/test';

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'], authUsers: authTestUsers } },
  ...(process.platform === 'win32' && !process.env.CI
    ? []
    : [{ name: 'firefox', use: { ...devices['Desktop Firefox'], authUsers: authTestUsers } }]),
  { name: 'webkit', use: { ...devices['Desktop Safari'], authUsers: authTestUsers } },
];

export default defineConfig<FrameworkFixtures>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        environmentInfo: {
          test_environment: environment.name,
          node_version: process.version,
          operating_system: process.platform,
        },
      },
    ],
  ],
  use: {
    baseURL: environment.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Firefox's Windows binary requires a system runtime that is not present on every Windows machine.
  // Keep it in CI's full cross-browser matrix while keeping the default local Windows run reliable.
  projects,
  webServer: environment.startsDemoServer ? {
    command: 'node demo/server.js',
    url: 'http://127.0.0.1:4173/health',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
    env: {
      QA_CUSTOMER_EMAIL: authTestUsers.customer.email,
      QA_CUSTOMER_PASSWORD: authTestUsers.customer.password,
      QA_AGENT_EMAIL: authTestUsers.agent.email,
      QA_AGENT_PASSWORD: authTestUsers.agent.password,
    },
  } : undefined,
});
