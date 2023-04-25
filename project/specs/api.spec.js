//Импорт зависимостей
import playwright from 'playwright';
import {ConfigReq} from '../framework/services/data.js';
import {config} from '../framework/config/config.js';
import {textToDetect} from '../framework/fixtures/testdata.js';
import {configPW} from '../framework/config/PlaywrightConfig.js';
const request = new ConfigReq({baseURL: config.urlapi});
let page, browser, context, title, newtoken

//Функция для получения текущей даты UTC в формате yyyy-mm-dd
function getCurrentDate () {
    let currentDate = new Date().toISOString().substr(0, 10);
    //console.log(currentDate); 
    return currentDate
}

//Проверка авторизации
describe('#1_get_authentication_token', () => {
    //Запускаем перед каждым тестом браузер и создаём новую вкладку
    beforeEach(async function() {
        browser = await playwright.chromium.launch(configPW.mainSettings);      
        context = await browser.newContext();
        page = await context.newPage();
    });
    //Делаем скриншот и закрываем браузер после каждого теста. Заменяем недопустимые символы в имени файла нижними подчёркиваниями перед сохранением.
    afterEach(async function() {
        await page.screenshot({path:`schreenshots/${title.replace(/[/\\?%*:|"<>]/g, '_')}.png`, fullPage: true})
        await browser.close()
    });
    //Проверяем, есть ли доступ до главной страницы сайта. Без try-catch, т.к. смысла продолжать нет в данном случае.
    test('test_if_main_page_exists', async function check_page() {
        await page.goto(configPW.mainPage);    
        title = await page.title()
        expect(title).toEqual("Detect Language API | Fast, Secure Language Identification")
    },7000);
    //Переходим на страницу авторизации, вводим данные, отправляем, получаем перенаправление на страницу личного кабинета, откуда забираем токен
    test('sign_in_and_redirect_to_token_page', async function sign_in_and_get_token() {
        try { 
            await page.goto(configPW.mainPage);
            await page.locator(configPW.selectors.logInLink).click();
            await page.waitForLoadState('domcontentloaded');
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
            console.error("!!! descr#1_test#2 ",error);
            expect(error).toMatch('error');
        }        
    },10000);
});

//Проверка распознавания языков
describe('#2_test_language_detect', () => {
    //Тест распознавания языка без отправки токена
    test('test_detect_language_from_simple_word_without_token', async function detect_short_no_auth() {
        try {            
            const response = await request.post("detect",textToDetect.word.fr.el);
            expect(response.status).toBe(401);                
        } catch (error) {            
            console.error("!!! descr#2_test#1 ",error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            //console.warn("response data: " + JSON.stringify(error.response.data))
            expect(error.response.data.error.message).toBe("Invalid API key");            
        }
    });
    //Тест распознавания языка с неверным путём
    test('test_detect_language_from_simple_word_with_wrong_path', async function detect_short_wrong_path() {
        try {            
            const response = await request.post("defect",textToDetect.word.fr.el, "Bearer", newtoken);
            expect(response.status).toBe(404);                
        } catch (error) {            
            console.error("!!! descr#2_test#2 ",error);
            expect(error.response.status).toBe(404);
            expect(error.response.statusText).toBe("Not Found");
            //console.warn("response data: " + JSON.stringify(error.response.data))
            expect(error.response.data).toBe("404 page not found");            
        }
    });
    //Тест распознавания языка с использвоанием неподдерживаемого сайтом header'а
    test('test_detect_language_from_simple_word_with_wrong_content-type', async function detect_short_wrong_content_type() {
        try {            
            const response = await request.post("detect",textToDetect.word.fr.el,"Bearer",newtoken,"application/json;");
            expect(response.status).toBe(400);                
        } catch (error) {            
            console.error("!!! descr#2_test#3 ",error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            //console.warn("response data: " + JSON.stringify(error.response.data))
            expect(error.response.data).toBe("");            
        }
    });
    //Тест распознавания языка с отправкой запроса без текста
    test('test_detect_language_from_empty_content', async function detect_empty() {
        try {            
            const response = await request.post("detect",null,"Bearer",newtoken);
            expect(response.status).toBe(200);   
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data)) 
            expect(response.data.data.detections.length).toBe(0);
        } catch (error) {            
            console.error("!!! descr#2_test#4 ",error);
            expect(error).toMatch('error');      
        }
    });
    //Тест распознавания языка с отправкой символов без букв
    test('test_detect_language_from_symbols', async function detect_symbols() {
        try {            
            const response = await request.post("detect",textToDetect.symbols,"Bearer",newtoken);
            expect(response.status).toBe(200);   
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data)) 
            expect(response.data.data.detections.length).toBe(0);
        } catch (error) {            
            console.error("!!! descr#2_test#5 ",error);
            expect(error).toMatch('error');      
        }
    });
    //Тест распознавания языка с отправкой числа арабскими цифрами (что странно, не детектит, римские неверно определяет, китайские без уверенности и считает японскими...)
    test('test_detect_language_from_arabic_number', async function detect_number() {
        try {            
            const response = await request.post("detect",textToDetect.number,"Bearer",newtoken);
            expect(response.status).toBe(200);   
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data)) 
            expect(response.data.data.detections.length).toBe(0);
        } catch (error) {            
            console.error("!!! descr#2_test#6 ",error);
            expect(error).toMatch('error');      
        }
    });
    //Тест распознавания языка по одному слову (французский)
    test('test_detect_fr_language_from_simple_word', async function detect_short() {
        try {            
            const response = await request.post("detect",textToDetect.word.fr.el,"Bearer",newtoken);
            expect(response.status).toBe(200);  
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data))
            expect(response.data.data.detections[0].language).toBe("fr");
            expect(response.data.data.detections[0].isReliable).toBe(true);
            expect(response.data.data.detections[0].confidence).toBeGreaterThan(5);
        } catch (error) {
            console.error("!!! descr#2_test#7 ",error);
            expect(error).toMatch('error');            
        }
    });
    //Тест распознавания языка с отправкой китайского текста в виде закодированного URI (utf8 в последовательность по два байта с разделителем "%" каждого байта)
    test('test_detect_chinese_language_from_text_URIencoded', async function detect_URIencoded() {
        try { 
            const encoded = encodeURI(textToDetect.sentence.zh.el);
            const response = await request.post("detect",encoded,"Bearer",newtoken,null,false);
            expect(response.status).toBe(200);  
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data));
            expect(response.data.data.detections[0].language).toBe("zh");
            expect(response.data.data.detections[0].isReliable).toBe(true);
            expect(response.data.data.detections[0].confidence).toBeGreaterThan(10);            
        } catch (error) {
            console.error("!!! descr#2_test#8 ",error);
            expect(error).toMatch('error');            
        }
    });
    //Тест распознавания языков с отправкой массива из отдельных слов и предложений на разных языках
    test('test_detect_language_from_batch_of_texts_and_words', async function detect_batch() {
        try {            
            const response = await request.post("detect",textToDetect.getArrayToSend(),"Bearer",newtoken);
            expect(response.status).toBe(200);  
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data));
            for (let i=0; i<textToDetect.getBatch().length; i++) {                
                expect(response.data.data.detections[i][0].language).toBe(textToDetect.getBatch()[i].code);
                expect(response.data.data.detections[i][0].isReliable).toBe(true);            
            }        
        } catch (error) {
            console.error("!!! descr#2_test#8 ",error);
            expect(error).toMatch('error');            
        }
    });
});

//Проверка поддерживаемых языков
describe('#3_test_languages_list', () => {
    //Тест получения списка языков без токена
    test('test_get_language_list_without_token', async function get_lngList_no_auth() {
        try {            
            const response = await request.get();
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data[0]).toHaveProperty("code", "aa");
        } catch (error) {                       
            console.error("!!! descr#3_test#1 ",error);
            expect(error).toMatch('error');      
        }
    });
    //Тест получения языков с токеном
    test('test_get_language_list_with_token', async function get_lngList_with_auth() {
        try {            
            const response = await request.get("languages","Bearer",newtoken);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data[0]).toHaveProperty("code", "aa");
        } catch (error) {                       
            console.error("!!! descr#3_test#2 ",error);
            expect(error).toMatch('error');      
        }
    });
});

//Проверка статуса пользователя
describe('#4_test_user_status', () => {
    //Тест получения статуса без токена
    test('test_get_user_status_without_token', async function get_user_status_no_auth() {
        try {            
            const response = await request.get("user/status");
            expect(response.status).toBe(401);                
        } catch (error) {            
            console.error("!!! descr#4_test#1 ",error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            //console.warn("response data: " + JSON.stringify(error.response.data));
            expect(error.response.data.error.message).toBe("Invalid API key");            
        }
    });
    //Тест получения статуса с кривым токеном
    test('test_get_user_status_with_bad_token', async function get_user_status_bad_auth() {
        try {                                                  
            const response = await request.get("user/status", "Bearer", "&^*#^&#@&&@*&[]{}*!@$\|"); //6e3ae9b237bd4bef9dfe811b06c63283
            expect(response.status).toBe(401);                
        } catch (error) {            
            console.error("!!! descr#4_test#2 ",error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            //console.warn("response data: " + JSON.stringify(error.response.data));
            expect(error.response.data.error.message).toBe("Invalid API key");            
        }
    });
    //Тест получения статуса с правильным токеном
    test('test_get_user_status', async function get_user_status() {
        try {            
            const response = await request.get("user/status","Bearer",newtoken);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            //console.warn("response data: " + JSON.stringify(response.data));
            expect(response.data.date).toMatch(getCurrentDate());
            expect(response.data.status).toBe("ACTIVE");
        } catch (error) {                       
            console.error("!!! descr#4_test#3 ",error);
            expect(error).toMatch('error');      
        }
    });
});
