import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserType } from '@playwright/test';
import 'dotenv/config';
import { LoginPluginLogger } from './LoginPluginLogger';

setDefaultTimeout(30 * 1000);

let browser: Browser;
let stepCounter = 0;

// .env dosyasından tarayıcı ve headless ayarlarını okuma
const selectedBrowserName = (process.env.BROWSER || 'chromium').toLowerCase();
const isHeadless = process.env.HEADLESS ? process.env.HEADLESS === 'true' : false;

const browsers: Record<string, BrowserType> = {
    chromium,
    firefox,
    webkit,
};

// Geçersiz bir isim yazılırsa güvenli fallback olarak chromium seçer
const selectedBrowserType: BrowserType = browsers[selectedBrowserName] || chromium;

async function launchSelectedBrowser(): Promise<Browser> {
    if (selectedBrowserName === 'firefox') {
        return await firefox.launch({
            headless: isHeadless,
            slowMo: Number(process.env.SLOW_MO) || 0,
            timeout: 60000,
            firefoxUserPrefs: {
                'dom.webnotifications.enabled': false,
                'intl.accept_languages': 'en-US, en',
            },
        });
    }

    if (selectedBrowserName === 'webkit') {
        return await webkit.launch({
            headless: isHeadless,
            slowMo: Number(process.env.SLOW_MO) || 0,
            timeout: 60000,
        });
    }

    // Varsayılan: Chromium (Windows Uygulama Denetimi engeline takılmaması için channel: 'chrome' kullanılır)
    return await chromium.launch({
        channel: 'chrome',
        headless: isHeadless,
        slowMo: Number(process.env.SLOW_MO) || 0,
        timeout: 60000,
        args: [
            '--start-maximized',
            '--window-position=0,0',
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
    });
}

BeforeAll(async function () {
    browser = await launchSelectedBrowser();
});

Before(async function (scenario) {
    // 1. Logger Başlangıç Kaydı
    stepCounter = 0;
    const tags = scenario.pickle.tags.map(t => t.name).join(', ') || 'Tag Yok';
    const featureFilePath = scenario.pickle.uri;
    const featureFileName = featureFilePath.split('/').pop()?.split('\\').pop() || 'Unknown Feature';
    LoginPluginLogger.logScenarioStart(scenario.pickle.name, tags, featureFileName);

    // 2. Tarayıcı kapalıysa yeniden başlat
    if (!browser) {
        browser = await launchSelectedBrowser();
    }

    // 3. Her Ebat/Ekran Çözünürlüğünde Birebir Aynı Olması İçin İzole Context:
    this.context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        locale: 'en-US',
    });

    this.page = await this.context.newPage();
});

BeforeStep(function (step) {
    stepCounter++;
    LoginPluginLogger.logStep(step.pickleStep.text, stepCounter);
});

AfterStep(function (step) {
    if (step.result?.status === Status.FAILED) {
        LoginPluginLogger.logError(`Step Başarısız Oldu -> ${step.pickleStep.text}`);
    }
});

After(async function (scenario) {
    // Senaryo sonucunu logla
    const isPassed = scenario.result?.status === Status.PASSED;
    LoginPluginLogger.logScenarioEnd(scenario.pickle.name, isPassed);

    // Her senaryo sonunda sayfayı ve context'i kapat
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
});

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
});