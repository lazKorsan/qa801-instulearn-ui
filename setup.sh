#!/bin/bash
echo "=== Playwright + TypeScript + Cucumber Kurulumu Başlıyor (Sadece Chromium) ==="

echo "[1/7] npm init ve temel paketler..."
npm init -y

echo "[2/7] TypeScript ve Node tipleri..."
npm install --save-dev typescript @types/node

echo "[3/7] Playwright Test..."
npm install --save-dev @playwright/test

echo "[4/7] Sadece Chromium tarayıcısını indir..."
npx playwright install chromium

echo "[5/7] Dotenv..."
npm install dotenv --save

echo "[6/7] Cucumber ve TypeScript çalıştırıcı..."
npm install --save-dev @cucumber/cucumber ts-node

echo "[7/7] Allure raporlama..."
npm install --save-dev allure-playwright allure-commandline allure-cucumberjs

echo "[8/8] tsconfig-paths yüklenmesi..."
npm install -D tsconfig-paths

echo "=== Kurulum Tamamlandı ==="