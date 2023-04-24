import {config} from './config.js';

export const configPW = {
    mainSettings:{
        headless: true,
        viewport: {width: 1920, height: 1080},
        ignoreHTTPSErrors: true,
        baseURL: config.urlapi,
        slowMo: 500
    },
    mainPage: config.url,
    loginPage: "/users/sign_in",
    selectors: {
        login: 'input[id=user_email]', 
        password: 'input[id=user_password]',
        loginBtn: 'input[type=submit]',
        loginSuccess: 'div[role=alert]',
        token: 'input[type=text][class=form-control]'
    }
};
