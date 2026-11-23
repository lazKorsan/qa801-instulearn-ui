
# qa801-instulearn-ui

Playwright + TypeScript ile yazılmış UI test otomasyon framework'ü.
Test edilen site: **https://qa.instulearn.com/**

Framework'te iki ayrı çalışma biçimi vardır:

| Tür | Araç | Amaç |
|---|---|---|
| **Native testler** | Playwright Test (`*.spec.ts`) | Senaryoyu önce düz kodla yazıp doğrulamak |
| **Cucumber testleri** | Cucumber.js (`*.feature`) | Page class metotlarını Gherkin adımlarıyla çalıştırmak |

---

## 1. Gereksinimler

- **Node.js 20 veya üzeri** (`node -v` ile kontrol edin)
- **npm** (Node ile birlikte gelir)
- **Git**
- **WebStorm** (önerilen IDE)
- **Java 8+** (sadece Allure raporunu görüntülemek için gerekir, `java -version`)

## 2. Kurulum

```bash
git clone <repo-url>
cd qa801-instulearn-ui
npm ci
npx playwright install
```

Windows'ta `.env` dosyasını oluşturmak için:

```bash
copy .env.example .env
```

(macOS/Linux: `cp .env.example .env`)

Ardından `.env` dosyasını açıp kendi değerlerinizi girin. Gerçek kullanıcı adı / şifre bilgilerini ekip liderinden alın. **`.env` dosyası asla GitHub'a gönderilmez.**

> `npm install` yerine **`npm ci`** kullanın. `package-lock.json` içindeki sürümleri birebir kurar, herkeste aynı ortam olur.
>
> `npx playwright install` unutulmamalı: tarayıcılar `node_modules` ile gelmez, ayrıca indirilir.

### Kullanılan paketler

| Paket | Sürüm | Görevi |
|---|---|---|
| `@playwright/test` | 1.65.1 | Tarayıcı otomasyonu ve native test runner |
| `@cucumber/cucumber` | 13.3.0 | BDD / Gherkin runner |
| `typescript` | 5.9.3 | TypeScript derleyicisi |
| `ts-node` | 10.9.2 | TypeScript dosyalarını doğrudan çalıştırır |
| `tsconfig-paths` | 4.2.0 | `tsconfig` path alias desteği |
| `dotenv` | 18.0.10 | `.env` dosyasını okur |
| `allure-playwright` | 3.15.0 | Native testler için Allure raporu |
| `allure-cucumberjs` | 3.15.0 | Cucumber testleri için Allure raporu |
| `allure-commandline` | 2.46.1 | Allure raporunu üretir/açar |
| `rimraf` | 6.1.3 | Eski rapor/çıktı klasörlerini temizler |
| `@types/node` | 26.6.6 | Node tip tanımları |

## 3. WebStorm Ayarları

1. **File > Open** ile proje klasörünü açın.
2. **Settings > Languages & Frameworks > Node.js** altında Node interpreter'ı seçin (20+).
3. Terminalde `npm ci` çalıştırın.
4. **Settings > Plugins** altında **Cucumber.js** eklentisinin açık olduğunu kontrol edin (step'e gitme ve eksik step'i bulma için).
5. Native testlerde `test(...)` satırının yanındaki yeşil ▶ ikonuyla tek test çalıştırabilir veya debug edebilirsiniz.

## 4. Proje Yapısı

```text
qa801-instulearn-ui
├── src
│   ├── pages                  # Page class'ları (locator + metotlar burada)
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   └── ...
│   ├── utils                  # Ortak yardımcı sınıflar
│   └── tests
│       ├── native             # Native Playwright testleri
│       │   └── US001Login.spec.ts
│       ├── features           # Cucumber feature dosyaları
│       │   └── US001Login.feature
│       ├── step-definitions   # Cucumber adımları (sadece page metotlarını çağırır)
│       │   └── LoginSteps.ts
│       └── hooks              # Before/After hook'ları, world
├── .env.example
├── .gitignore
├── cucumber.json
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

> Klasör isimleri örnektir. Projedeki gerçek yapıya göre güncelleyin.

## 5. Testleri Çalıştırma

> Aşağıdaki script isimleri önerilendir. `package.json` içindeki `scripts` bölümüne ekleyin veya mevcut isimlere göre düzenleyin.

```json
"scripts": {
  "test:native": "playwright test",
  "test:native:headed": "playwright test --headed",
  "test:native:ui": "playwright test --ui",
  "test:cucumber": "cucumber-js",
  "report:allure": "allure generate allure-results --clean -o allure-report && allure open allure-report",
  "clean": "rimraf allure-results allure-report test-results playwright-report"
}
```

### 5.1 Native testler

```bash
npm run test:native                       # tüm native testler
npm run test:native:headed                # tarayıcıyı görerek
npx playwright test src/tests/native/US001Login.spec.ts   # tek dosya
npx playwright test -g "gecerli bilgilerle giris"         # isme göre
npx playwright test --debug               # debug modu
npx playwright show-report                # Playwright HTML raporu
```

### 5.2 Cucumber testleri

```bash
npm run test:cucumber                              # tüm feature'lar
npx cucumber-js src/tests/features/US001Login.feature   # tek feature
npx cucumber-js --tags "@smoke"                    # tag ile
npx cucumber-js --tags "@login and not @wip"       # tag kombinasyonu
```

### 5.3 Allure raporu

```bash
npm run report:allure
```

## 6. Çalışma Yöntemi (Stajyerler İçin)

Her user story aşağıdaki **3 aşamada** ilerler. Sırayı atlamayın.

### Aşama 1: Native test yaz

Senaryoyu önce `src/tests/native/` altında, hiçbir page class kullanmadan, düz Playwright koduyla yazın. Amaç: locator'lar doğru mu, akış çalışıyor mu görmek.

```ts
// src/tests/native/US001Login.spec.ts
import { test, expect } from '@playwright/test';

test('gecerli bilgilerle giris yapilabilmeli', async ({ page }) => {
  await page.goto('https://qa.instulearn.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator('#email').fill(process.env.STUDENT_EMAIL!);
  await page.locator('#password').fill(process.env.STUDENT_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/panel/);
});
```

Test yeşil olmadan Aşama 2'ye geçmeyin.

### Aşama 2: Kodu Page class'a metot olarak taşı

Native testteki adımları `src/pages/` altındaki ilgili page class'a **metot** olarak taşıyın. Locator'lar class içinde tanımlanır, test dosyasında locator bulunmaz.

```ts
// src/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoggedIn() {
    await expect(this.page).toHaveURL(/panel/);
  }
}
```

Native test de artık bu metotları kullanacak şekilde sadeleştirilir ve **tekrar çalıştırılıp yeşil olduğu doğrulanır**:

```ts
test('gecerli bilgilerle giris yapilabilmeli', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(process.env.STUDENT_EMAIL!, process.env.STUDENT_PASSWORD!);
  await loginPage.verifyLoggedIn();
});
```

### Aşama 3: Cucumber'da metotlarla adımları çalıştır

Feature dosyasını yazın, step definition içinde **sadece page metotlarını çağırın**. Step içinde locator veya doğrudan `page.click()` yazılmaz.

```gherkin
# src/tests/features/US001Login.feature
@login
Feature: Giris islemi

  Scenario: Gecerli bilgilerle giris
    Given kullanici ana sayfayi acar
    When kullanici gecerli bilgilerle giris yapar
    Then kullanici panele yonlendirildigini dogrular
```

```ts
// src/tests/step-definitions/LoginSteps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../pages/LoginPage';

Given('kullanici ana sayfayi acar', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();
});

When('kullanici gecerli bilgilerle giris yapar', async function () {
  await this.loginPage.login(process.env.STUDENT_EMAIL!, process.env.STUDENT_PASSWORD!);
});

Then('kullanici panele yonlendirildigini dogrular', async function () {
  await this.loginPage.verifyLoggedIn();
});
```

### Kontrol listesi (PR öncesi)

- [ ] Native test yazıldı ve yeşil
- [ ] Mantık page class'a metot olarak taşındı, native test hâlâ yeşil
- [ ] Feature + step definition yazıldı, step'ler sadece page metotlarını çağırıyor
- [ ] Cucumber senaryosu yeşil
- [ ] Şifre/token kodda yok, `.env` kullanıldı
- [ ] `thread.sleep` benzeri sabit bekleme yok (`waitForTimeout` yerine Playwright'ın otomatik beklemesi / `expect`)

## 7. Kod Yazım Kuralları

- Locator'lar **sadece page class'larda** tutulur.
- Locator önceliği: `getByRole` > `getByLabel` / `getByText` > `data-testid` > `locator('css')`. XPath son çare.
- Her page class ortak metotlar için `BasePage`'den türetilebilir.
- Test verisi ve kimlik bilgileri `.env` içinde durur.
- Her test birbirinden bağımsız çalışabilmelidir.
- Dosya isimleri: `US001Login.spec.ts`, `US001Login.feature`, `LoginPage.ts`, `LoginSteps.ts`.

## 8. Git Akışı

```bash
git checkout -b feature/US001-login
git add .
git commit -m "US001: login testleri eklendi"
git push -u origin feature/US001-login
```

Sonrasında GitHub'da Pull Request açın.

**Commit'e girmeyecekler:** `node_modules/`, `.env`, `allure-results/`, `allure-report/`, `test-results/`, `playwright-report/`, `.idea/`

### Örnek `.gitignore`

```
node_modules/
.env
.idea/
allure-results/
allure-report/
test-results/
playwright-report/
blob-report/
playwright/.cache/
```

### Örnek `.env.example`

```
BASE_URL=https://qa.instulearn.com/
STUDENT_EMAIL=
STUDENT_PASSWORD=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## 9. Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|---|---|
| `Executable doesn't exist` hatası | `npx playwright install` çalıştırın |
| `Cannot find module` hatası | `npm ci` çalıştırın |
| `.env` değerleri `undefined` geliyor | `.env` dosyası var mı, `dotenv` config'te yükleniyor mu kontrol edin |
| Allure raporu açılmıyor | Java kurulu mu kontrol edin (`java -version`) |
| Cucumber step'i bulamıyor | `cucumber.json` içindeki `require` yollarının step klasörünü gösterdiğini kontrol edin |
| TypeScript hatası: `Cannot find name 'Given'` | `@cucumber/cucumber` import'unu kontrol edin |

## 10. İletişim

Sorularınız için ekip lideriyle iletişime geçin.
```

---

#Proje yapısini veren komut
proje yapisini vern komut
npx tree-node-cli -I "node_modules|.git|playwright-report|test-results" -o proje-yapisi.txt
npx tree-node-cli -I "node_modules|dist|.git|playwright-report|test-results" -o proje-yapisi.txt
PS C:\Users\user\WebstormProjects\playwright-vanilla99> npx tree-node-cli -I "node_modules|dist|.git|playwright-report|test-results" -o proje-yapisi.txt






# Report Way Balance - Kurulum ve Kullanım Kılavuzu

Bu proje, **Playwright**, **TypeScript** ve **Cucumber** framework'leri kullanılarak hazırlanan bir test otomasyon projesidir. Projeyi bilgisayarınıza kopyalayıp testleri sorunsuz bir şekilde koşturabilmek için aşağıdaki adımları sırasıyla takip etmeniz gerekmektedir.

## Gereksinimler

Projenin çalışabilmesi için bilgisayarınızda **Node.js** yüklü olmalıdır. Terminalinizden `node -v` ve `npm -v` komutlarını çalıştırarak yüklü olduğunu doğrulayabilirsiniz.

---

## 🛠️ Kurulum Adımları

### 1. Projeyi Bilgisayarınıza Klonlayın
Öncelikle GitHub üzerindeki bu depoyu bilgisayarınıza indirin ve proje klasörünün içerisine giriş yapın:
```bash
git clone <PROJE_GITHUB_LINKI>
cd report-way-balance
```

### 2. Gerekli Paketleri Yükleyin
`package.json` dosyasında bulunan test kütüphanelerini, TypeScript bağımlılıklarını ve raporlama araçlarını eksiksiz kurmak için terminalde şu komutu çalıştırın:
```bash
npm install
```
*(Eğer projede `package-lock.json` dosyası mevcutsa, sürümlerin birebir aynı kalması ve daha kararlı bir kurulum için alternatif olarak `npm ci` komutunu da kullanabilirsiniz.)*

### 3. Playwright Tarayıcılarını Kurun
Projede Playwright kullanıldığı için testlerin koşturulacağı tarayıcı motorlarının (Chromium, Firefox, WebKit) bilgisayarınıza indirilmesi gerekir. Paket yüklemesi bittikten sonra şu komutu çalıştırın:
```bash
npx playwright install
```

---

## 🚀 Testleri Çalıştırma Komutları

Kurulum işlemleri tamamlandıktan sonra, projedeki hazır betikleri (scripts) kullanarak testleri ve raporlamaları başlatabilirsiniz:

*   **Standart Playwright Testlerini Çalıştırma:**
    ```bash
    npm run test
    ```
*   **Cucumber / BDD Testlerini Çalıştırma:**
    ```bash
    npm run test:cucumber
    ```
*   **Testleri Koşturup Otomatik Allure Raporu Açma:**
    ```bash
    npm run test:report
    ```
*   **Eski Allure Raporu Verilerini Temizleme:**
    ```bash
    npm run allure:clean
    ```

## 📝 Notlar
*   Projede ortam değişkenleri için `dotenv` kullanılmaktadır. Eğer gerekliyse, proje kök dizininde `.env` dosyası oluşturup gerekli tanımlamaları yapmayı unutmayın.
