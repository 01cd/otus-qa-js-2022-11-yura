//Импорт зависимостей
import playwright from 'playwright';
import {config} from '../framework/config/config.js';
import {configPW} from '../framework/config/PlaywrightConfig.js';
let page, browser, context, title, newtoken

//Проверка сайта через браузер
describe('#1_site_UI-tests', () => {
    //Запускаем перед каждым тестом браузер и создаём новую вкладку
    beforeEach(async function() {
        browser = await playwright.chromium.launch(configPW.mainSettings);      
        context = await browser.newContext();
        page = await context.newPage();
    });
    //Делаем скриншот и закрываем браузер после каждого теста. Заменяем недопустимые символы в имени файла нижними подчёркиваниями перед сохранением.
    afterEach(async function() {
        await page.screenshot({path:`schreenshots/${title.replace(/[/\\?%*:|"<>]/g, '_')}.png`, fullPage: true});
        await browser.close();
    });
    //Проверяем, есть ли доступ до главной страницы сайта.
    test('test_if_main_page_exists', async function check_page() {
        await page.goto(configPW.mainPage);    
        title = await page.title();
        expect(title).toEqual("Detect Language API | Fast, Secure Language Identification");
    },7000);
    //Проверяем переход на страницу FAQ
    test('move_to_FAQ_page', async function move_to_faq() {
        await page.goto(configPW.mainPage);
        await page.locator(configPW.selectors.faqLink).click();
        title = await page.title();
        expect(title).toEqual("Frequently Asked Questions | Detect Language API");
    },4000);
    //Проверяем демо детект
    test('check_demo_detect', async function check_demo() {
        await page.goto(configPW.mainPage);
        await page.locator(configPW.selectors.demoForm).fill("こんばんわ"); 
        await page.click(configPW.selectors.demoBtn);
        title = await page.locator(configPW.selectors.demoResult).textContent();
        expect(await page.locator(configPW.selectors.demoResLng).textContent()).toBe("Japanese");
        //console.warn(await page.locator(configPW.selectors.demoResLng).textContent());
        //console.warn(title)
    },8000);
    //Проверяем закрытие модального окна результата детекта
    test('check_demo_detect_close_modal', async function check_demo() {
        await page.goto(configPW.mainPage);
        await page.locator(configPW.selectors.demoForm).fill("Буквы"); 
        await page.click(configPW.selectors.demoBtn);
        title = await page.locator(configPW.selectors.demoResult).textContent() + " Closed";
        expect(await page.locator(configPW.selectors.demoResLng).textContent()).toBe("Russian");
        await page.click(configPW.selectors.demoResCloseBtn);
        //console.warn(await page.locator(configPW.selectors.demoResWindowHidden).getAttribute('aria-hidden'));
        expect(await page.locator(configPW.selectors.demoResWindowHidden).getAttribute('aria-hidden')).toEqual("true");
    },10000);
    //Переходим на страницу авторизации, вводим данные, отправляем, получаем перенаправление на страницу личного кабинета, откуда забираем токен
    test('sign_in_and_redirect_to_token_page', async function sign_in_and_get_token() {
        try {
            await page.goto(configPW.mainPage);
            await page.locator(configPW.selectors.logInLink).click();
            await page.locator(configPW.selectors.login).fill(config.email);
            await page.locator(configPW.selectors.password).fill(config.password);
            await page.click(configPW.selectors.loginBtn);
            await page.waitForLoadState("networkidle"); 
            title = await page.locator(configPW.selectors.loginSuccess).textContent();
            newtoken = await page.locator(configPW.selectors.token).inputValue();
            //console.warn("!!! newtoken: ", newtoken);
            expect(title).toEqual("Signed in successfully.");
            expect(typeof newtoken).toBe("string");
        } catch (error) {
            console.error("!!! descr#1_test#5 ",error);
            expect(error).toMatch('error');
        }        
    },10000);
});

