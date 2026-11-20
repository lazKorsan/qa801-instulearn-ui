import {Given} from "@cucumber/cucumber";
import * as dotenv from 'dotenv';
import {ExamplePage} from "../pages/ExamplePage";
import {ReusableMethods} from "../utils/ReusableMethods";
import {LoggerHelper} from "../utils/LoggerHelper";
dotenv.config();



Given(/^Example kullanicisi "([^"]*)" sayfasina gider$/, async function (urlKey: string) {

    const url=process.env[urlKey]!;

    await this.page.goto(url);

    LoggerHelper.logInfo(`Example kullanicisi "${url}" sayfasina gider`);

});
Given(/^Example kullanicisi "([^"]*)" ve "([^"]*)" degerleri sayfaya giris yapar$/, async function (mailKey: string, passwordKey: string) {

    const mail=process.env[mailKey]!;
    const password=process.env[passwordKey]!;

    const examplePage= new ExamplePage(this.page);
    await examplePage.exLoginWithMethod(mail, password);

    LoggerHelper.logInfo(`Example kullanicisi "${mail}" ve "${password}" degerleri sayfaya giris yapar`)

});
Given(/^Example kullanicisi "([^"]*)" sayfasinda oldugunu dogrular$/, async function (expectedUrl: string) {

    const methods= new ReusableMethods(this.page);

    await methods.verifyUrl(expectedUrl);

    LoggerHelper.logInfo(`Example kullanicisi "${expectedUrl}" sayfasinda oldugunu dogrular`)

});