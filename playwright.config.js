import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5180',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node mock-server.mjs 4010',
      port: 4010,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'npm run dev -- --port 5180 --strictPort',
      url: 'http://localhost:5180',
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 800 } },
    },
  ],
});
