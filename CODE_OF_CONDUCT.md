================================================================================
PLAYWRIGHT - WINDOWS GÜVENLİK ENGELLEMELERİ VE TARAYICI ÇÖZÜM REHBERİ
================================================================================

Projeyi klonladıktan sonra "npx playwright install" komutuyla indirilen
tarayıcı sürücüleri (%LOCALAPPDATA%\ms-playwright), dijital imzasız
oldukları için Windows 11 güvenlik duvarları tarafından engellenebilir.

Aşağıdaki 3 farklı hata senaryosu ve kesin çözümleri adım adım verilmiştir:

--------------------------------------------------------------------------------
1. SORUN: Microsoft Defender "PrintDeps.exe" Uyarısı
--------------------------------------------------------------------------------
Belirti:
"Bu uygulamanın bir kısmı engellendi (PrintDeps.exe)" bildirimi çıkar.

Çözüm (Klasörü Windows Defender İstisnalarına Ekleme):
1. Windows Başlat menüsünden "Windows Güvenliği" uygulamasını açın.
2. Sol menüden "Virüs ve tehdit koruması" sekmesine girin.
3. "Virüs ve tehdit koruması ayarları" altındaki "Ayarları yönet" seçeneğine tıklayın.
4. Sayfayı en alta kaydırıp "Dışlamalar" > "Dışlamaları ekle veya kaldır" yolunu izleyin.
5. "+ Bir dışlama ekle" > "Klasör" seçeneğine tıklayın ve şu yolu ekleyin:
   %LOCALAPPDATA%\ms-playwright
   (Örnek tam yol: C:\Users\<KullaniciAdi>\AppData\Local\ms-playwright)

--------------------------------------------------------------------------------
2. SORUN: Chromium Başlatılamıyor ("Uygulama Denetimi ilkesi engelledi")
--------------------------------------------------------------------------------
Belirti:
"Failed to load Chrome DLL... Uygulama Denetimi ilkesi bu dosyayı engelledi (0x11C7)"
hatası alınır.

Çözüm (Sistemde Kurulu Resmi Chrome veya Edge Kullanımı):
Playwright'ın indirdiği imzasız Chromium yerine bilgisayarınızdaki dijital
imzalı Google Chrome'u kullanmak için projede "channel: 'chrome'" ayarı
aktif edilmiştir.
- Bilgisayarınızda Google Chrome kurulu olduğundan emin olun.
- .env dosyanızda BROWSER=chromium ayarlı olmalıdır.
- Eğer Chrome yerine Microsoft Edge kullanmak isterseniz config/hooks
  dosyasındaki channel değerini 'msedge' yapabilirsiniz.

--------------------------------------------------------------------------------
3. SORUN: Firefox / WebKit Başlatılamıyor ("spawn UNKNOWN" Hatası)
--------------------------------------------------------------------------------
Belirti:
.env dosyasında BROWSER=firefox veya BROWSER=webkit seçildiğinde
"Error: browserType.launch: spawn UNKNOWN" hatası alınır.

Neden:
Windows 11 "Akıllı Uygulama Denetimi (Smart App Control)" özelliği,
ms-playwright klasöründeki firefox.exe ve webkit dosyalarının çalışmasını
engellemektedir. (Standart Mozilla Firefox kurulumu Juggler protokolünü
desteklemediği için Playwright ile kullanılamaz.)

Çözüm A (Kişisel Bilgisayarlar İçin - Akıllı Uygulama Denetimi'ni Kapatma):
1. "Windows Güvenliği" uygulamasını açın.
2. Sol menüden "Uygulama ve tarayıcı denetimi" sekmesine tıklayın.
3. "Akıllı Uygulama Denetimi ayarları" bağlantısına girin.
4. Durumu "Kapalı (Off)" olarak değiştirin.
   (Not: Bu ayar kapatıldığında Windows sıfırlanmadan tekrar "Açık" yapılamaz.)

Çözüm B (Şirket Bilgisayarları / Ayar Kilitliyse):
- Ayar kurumsal politika (GPO) nedeniyle gri/kilitli ise kapatılamaz.
- Bu durumda kendi bilgisayarınızda .env dosyasında BROWSER=chromium
  (channel: 'chrome') kullanmaya devam edin.
- Firefox testlerini bu güvenlik kilidinin bulunmadığı ekip arkadaşınızın
  makinesinde veya CI/CD (Linux) ortamında koşturun.

--------------------------------------------------------------------------------
HIZLI KONTROL LİSTESİ (YENİ KURULUM YAPANLAR İÇİN)
--------------------------------------------------------------------------------
[ ] 1. Bağımlılıkları kurun:       npm ci
[ ] 2. Tarayıcıları indirin:       npx playwright install
[ ] 3. .env dosyasını oluşturun:   BROWSER=chromium ve HEADLESS=false ayarlayın
[ ] 4. Yukarıdaki engeller çıkarsa ilgili adımı uygulayın.
================================================================================