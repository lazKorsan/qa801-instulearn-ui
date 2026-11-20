import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import {ExamplePage} from "../../pages/ExamplePage";
import {LoggerHelper} from "../../utils/LoggerHelper";
dotenv.config();

test('EX005LoginTest TC01', async ({ page }) => {

    // env dosysindan deger cekme
    const url= process.env.BASE_URL!;
    await page.goto(url);

    LoggerHelper.logInfo(`Example kullanicisi "${url}" sayfasina gider`);




    await page.getByRole('link', { name: 'Login' }).click();

    const mail=process.env.MAIL!;
    await page.getByRole('textbox', { name: 'Email:' }).fill(mail);

    const password=process.env.PASSWORD!;
    await page.getByRole('textbox', { name: 'Password:' }).fill(password);

    await page.getByRole('button', { name: 'Login' }).click();

    // url dogrulama eklenecek  panel
    await expect(page).toHaveURL(/panel/);
});

test('EX005LoginTest TC02', async ({ page }) => {

    // env dosysindan deger cekme
    const url= process.env.BASE_URL!;
    await page.goto(url);


    const mail=process.env.MAIL!;
    const password=process.env.PASSWORD!;

    const examplePage = new ExamplePage(page);
    examplePage.exLoginWithMethod(mail, password);



    // url dogrulama eklenecek  panel
    await expect(page).toHaveURL(/panel/);

    LoggerHelper.logInfo(`Example kullanicisi "panel" sayfasinda oldugunu dogrular`);
});

test('EX005LoginTest TC03', async ({ page }) => {


    // env dosysindan deger cekme
    const url= process.env.BASE_URL!;
    await page.goto(url);

    const examplePage = new ExamplePage(page);

    await examplePage.getElementByName('Login').click();

    await examplePage.getElementByName('Email').fill(process.env.MAIL!);

    await examplePage.getElementByName('Password').fill(process.env.PASSWORD!);

    await examplePage.getElementByName('Submit').click();




    // url dogrulama eklenecek  panel
    await expect(page).toHaveURL(/panel/);

    LoggerHelper.logInfo(`Example kullanicisi "panel" sayfasinda oldugunu dogrular`);
});