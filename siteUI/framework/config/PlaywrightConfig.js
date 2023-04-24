import {config} from './config.js';

export const configPW = {
    mainSettings:{
        headless: false,
        viewport: {width: 1920, height: 1080},
        ignoreHTTPSErrors: true,
        baseURL: config.urlapi,
        slowMo: 500
    },
    mainPage: config.url,
    selectors: {
        logInLink: 'a[href^="/users/sign_in"]',
        login: 'input[id=user_email]', 
        password: 'input[id=user_password]',
        loginBtn: 'input[type=submit]',
        loginSuccess: 'div[role=alert]',
        token: 'input[type=text][class=form-control]',
        faqLink: 'li:nth-child(5)[class=nav-item]',
        demoForm: 'textarea[id=demo-q]',
        demoBtn: 'input[value="Detect Language"]',
        demoResult: '.container h4',
        demoResLng: 'td:nth-child(1)',
        demoResCloseBtn: 'button[class="close"]',
        demoResWindow: 'div[class=modal-content]',
        demoResWindowHidden: 'div[id="demo-modal"]'
    }
};
