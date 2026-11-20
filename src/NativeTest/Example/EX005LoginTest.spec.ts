import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import {ExamplePage} from "../../pages/ExamplePage";
dotenv.config();

test('EX005LoginTest TC01', async ({ page }) => {

    // env dosysindan deger cekme
    const url= process.env.BASE_URL!;
    await page.goto(url);


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
});