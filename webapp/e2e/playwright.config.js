import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the production build, the way players get the app
export default defineConfig({
  testDir: '.',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/wizard_tracker/',
    locale: 'el-GR', // the tests read Greek labels; the language switch has its own test
    trace: 'retain-on-failure',
  },
  // The app is used on phones at the table
  projects: [{ name: 'mobile', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    cwd: '..',
    url: 'http://localhost:4173/wizard_tracker/',
    reuseExistingServer: !process.env.CI,
  },
})
