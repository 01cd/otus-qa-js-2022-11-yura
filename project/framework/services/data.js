//Импорт зависимостей
import axios from 'axios';
import qs from 'qs'; 
import {config} from '../config/config.js';
import BaseConfig from '../config/AxiosConfig.js';

//Создание основного класса для работы с сайтом через наследование от базового класса из конфига
export class ConfigReq extends BaseConfig {
    //Конструктор
    constructor({url, method, baseURL, params, paramsSerializer, data, headers}) {
        super();
        this.url = url;
        this.method = method;
        this.baseURL = baseURL;
        this.params = params;
        this.paramsSerializer = paramsSerializer;
        this.data = data;
        this.headers = headers;
    }
    //Метод получения конфига для аксиоса на запрос
    getConfigObj() {
        return {
            url: this.url,
            method: this.method,
            baseURL: this.baseURL,
            params: this.params,
            paramsSerializer: this.paramsSerializer,
            data: this.data,
            headers: this.headers,
            timeout: this.timeout,
            withCredentials: this.withCredentials,
            responseType: this.responseType,
            responseEncoding: this.responseEncoding,
            maxContentLength: this.maxContentLength,
            maxBodyLength: this.maxBodyLength,
            maxRedirects: this.maxRedirects
        }
    }
    //Метод для получения header'ов
    getHeaders(auth, token, appJSON) {
        if (auth) {
            return {
                'Accept': "*/*",
                'content-type': (appJSON || "")+'charset=utf-8',
                'Authorization': "Bearer " + (token || config.token)            
            }
        } else {        
            return {'Accept': "*/*"}
        } 
    }
    //Метод для получения параметров
    parseData(data) {
        if (typeof data === "string") {
            return {q:data}
        }
        if (Array.isArray(data)) {
            return {q:data}
        }
        return ""    
    }
    //Метод для запроса get
    async get(path, auth, token, appJSON) {
        this.method = "get";
        this.url = `/${this.verAPI}/${path || "languages"}`;
        this.headers = this.getHeaders(auth, token, appJSON);
        let toSend = this.getConfigObj()
        console.log("request: " + JSON.stringify(toSend))
        return await axios(toSend)
    }
    //Метод для запроса post
    async post(path, data, auth, token, appJSON, isEncode) {
        this.method = "post";
        this.url = `/${this.verAPI}/${path || "detect"}`;
        this.params = this.parseData(data);
        //добавлены сериализатор и qs только из-за того, что иначе аксиос конвертирует ури, когда не нужно и сайт не может распознать получившееся.
        this.paramsSerializer = function (params) {return qs.stringify(params, { encode: isEncode})};
        this.headers = this.getHeaders(auth, token, appJSON);
        let toSend = this.getConfigObj()
        console.log("request: " + JSON.stringify(toSend))
        return await axios(toSend)
    }
}
