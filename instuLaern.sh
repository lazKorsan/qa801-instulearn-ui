#!/bin/bash

# Renk tanımları (color 0A karşılığı: yeşil yazı)
GREEN='\033[0;32m'
NC='\033[0m' # No Color

while true; do
    clear
    echo -e "${GREEN}==================== PLAYWRIGHT KOMUTLARI ====================${NC}"
    echo ""
    echo "1. Test UI'ı ac (npx playwright test --ui)"
    echo "2. Codegen baslat (npx playwright codegen https://qa.instulearn.com/)"
    echo "3. Tum testleri calistir (npx playwright test)"
    echo "4. Belirli testi calistir"
    echo "5. Report ac (npx playwright show-report)"
    echo "6. allure report paketi olustur (allure generate target/allure-results -o target/allure-report --clean)"
    echo "7. allure report ac (allure open target/allure-report)"
    echo "0. Cikis"
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo ""

    read -p "Seciminiz: " secim

    case "$secim" in
        1)
            echo ""
            echo "Calistiriliyor: npx playwright test --ui"
            echo "------------------------------------------------"
            npx playwright test --ui
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        2)
            echo ""
            echo "Calistiriliyor: npx playwright codegen https://qa.instulearn.com/"
            echo "------------------------------------------------"
            npx playwright codegen https://qa.instulearn.com/
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        3)
            echo ""
            echo "Calistiriliyor: npx playwright test"
            echo "------------------------------------------------"
            npx playwright test
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        4)
            echo ""
            read -p "Test dosyasini girin (ornek: login.spec.ts): " testadi
            echo "Calistiriliyor: npx playwright test $testadi"
            echo "------------------------------------------------"
            npx playwright test "$testadi"
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        5)
            echo ""
            echo "Calistiriliyor: npx playwright show-report"
            echo "------------------------------------------------"
            npx playwright show-report
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        6)
            echo ""
            echo "Calistiriliyor: allure generate target/allure-results -o target/allure-report --clean"
            echo "------------------------------------------------"
            allure generate target/allure-results -o target/allure-report --clean
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        7)
            echo ""
            echo "Calistiriliyor: allure open target/allure-report"
            echo "------------------------------------------------"
            allure open target/allure-report
            echo "------------------------------------------------"
            echo "Komut tamamlandi!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
        0)
            echo "Cikis yapiliyor..."
            sleep 1
            exit 0
            ;;
        *)
            echo "Gecersiz secim!"
            read -p "Devam etmek icin Enter'a basin..."
            ;;
    esac
done