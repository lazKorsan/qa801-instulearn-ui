import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

// HEADLESS tanımlı değilse varsayılan olarak false kabul eder
const isHeadless = process.env.HEADLESS ? process.env.HEADLESS === 'true' : false;

// .env içinde BROWSER tanımlı değilse varsayılan olarak 'chromium' seçer
const selectedBrowser = (process.env.BROWSER || 'chromium').toLowerCase();

// Tüm tarayıcı profilleri
const allProjects = [
  {
    name: 'chromium',
    use: {
      channel: 'chrome', // Sistemdeki kurulu Chrome'u kullanır
      viewport: null,
      launchOptions: {
        args: [
          '--start-maximized',
          '--disable-notifications',
          '--disable-popup-blocking',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-extensions',
          '--disable-blink-features=AutomationControlled',
          '--force-device-scale-factor=1.0',
          '--disable-search-engine-choice-screen',
          '--lang=en-US',
        ],
      },
    },
  },
  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
      viewport: { width: 1920, height: 1080 },
      launchOptions: {
        firefoxUserPrefs: {
          'dom.webnotifications.enabled': false,
          'intl.accept_languages': 'en-US, en',
        },
      },
    },
  },
  {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
      viewport: { width: 1920, height: 1080 },
    },
  },
];

// BROWSER=all yazılırsa hepsini, aksi halde .env'de seçilen tek tarayıcıyı aktif eder
const activeProjects =
    selectedBrowser === 'all'
        ? allProjects
        : allProjects.filter((p) => p.name === selectedBrowser);

export default defineConfig({
  testDir: './',
  testIgnore: [
    '**/node_modules/**',
    '**/target/**', // rapor/artifact klasörleri test olarak algılanmasın
  ],
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Test artifact'ları (screenshot, video, trace) buraya yazılır
  outputDir: 'target/test-results',

  reporter: [
    // Playwright HTML raporu -> target/playwright-report
    ['html', { outputFolder: 'target/playwright-report', open: 'never' }],

    // Konsol listesi
    ['list'],

    // Allure sonuçları -> target/allure-results (Cucumber ile aynı çatı)
    [
      'allure-playwright',
      {
        resultsDir: 'target/allure-results',
        detail: true,
        outputFolder: 'target/allure-results', // bazı sürümler bunu bekler
      },
    ],
  ],

  use: {
    headless: isHeadless,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  // Eğer .env'ye geçersiz bir isim yazılırsa güvenli fallback olarak chromium açar
  projects: activeProjects.length > 0 ? activeProjects : [allProjects[0]],
});