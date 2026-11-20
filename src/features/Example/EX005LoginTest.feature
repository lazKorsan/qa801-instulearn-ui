@Example
  Feature: Bir kullanici olarak siteye kaydoldugum email ve password bilgilerimle login olabilmek istiyorum.
    @EX005LoginTestTC01
    Scenario: Login formuna gecerli bilgiler girilip Login butonuna tiklandiginda sisteme giris yapilabilmeli.
      * Example kullanicisi "BASE_URL" sayfasina gider
      * Example kullanicisi "MAIL" ve "PASSWORD" degerleri sayfaya giris yapar
      * Example kullanicisi "panel" sayfasinda oldugunu dogrular