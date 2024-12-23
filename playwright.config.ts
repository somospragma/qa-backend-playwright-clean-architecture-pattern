import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  use: {
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure"
  },
  testDir: './tests',
  retries: 0,
  reporter: [['list'], ['html']]
});
