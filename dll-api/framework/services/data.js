import axios from 'axios';
import {login_gena, password_gena} from '../fixtures/gens.js';
import {config} from '../config/config.js';
const crypto = require('crypto');

function uuidv4() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    let uuid = [u.substr(0,8), u.substr(8,4), '4000-8' + u.substr(13,3), u.substr(16,12)].join('-');
    return uuid
}
    
let token = false;    

const user = {
    send: (method, url, data, headers) => {
        let toSend={};
        toSend.method = (method) ? method : "post";
        toSend.url = config.url + ((url) ? url : "Account/v1/Authorized");
        toSend.data = (data) ? data : {userName: config.user, password: config.password};
        toSend.headers = (headers) ? headers : {'Accept': '*/*', 'Content-Type': 'application/json; charset=utf-8'};
        console.log("url: "+toSend.url)
        console.log("credentials: "+JSON.stringify(toSend.data))
        return axios(toSend)
    }    
};
    
user.create = async function (data) { //из-за багов в сайте может не всегда создаваться (например, не воспринимает '~' или '№' как символ в пароле)
    let method = 'post';
    let url = 'Account/v1/User';
    data = (data) ? data : {userName: login_gena("userN",666,66666), password: password_gena(4,10)};
    const res = await this.send(method, url, data);
    return [res,data]
};    
user.auth = async function (data) {
    let method = 'post';
    let url = 'Account/v1/Authorized';
    data = (data) ? data : {userName: config.user, password: config.password};
    const res = await this.send(method, url, data);
    return res
}; 
user.token = async function (data) {
    if (token) {
        return token
    }
    let method = 'post';
    let url = 'Account/v1/GenerateToken';
    data = (data) ? data : {userName: config.user, password: config.password};
    const res = await this.send(method, url, data);
    return res
};
user.delete = async function (data,userID,token) { // если не подали данные, то генерируем новые, чтобы получить ошибку по авторизации
    let method = 'delete';
    userID = (userID) ? userID : uuidv4();
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            console.log("del_token: "+token.data.token);
            return token.data.token        
        } else if (!token && !data) {
            return uuidv4()
        }
        return token    
    };
    let url = 'Account/v1/User/'+userID;
    data = (data) ? data : {userName: login_gena("userN",666,66666), password: password_gena(4,10)};
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8', 'Authorization': "Bearer " + await getToken(data)};
    const res = await this.send(method, url, data, headers);
    return res
}; 
user.info = async function (data,userID,token) {
    let method = 'get';
    userID = (userID) ? userID : config.userID;
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            return token.data.token            
        } else if (!token && !data) {
            return config.token
        }
        return token    
    };
    let url = 'Account/v1/User/'+userID;
    data = (data) ? data : {userName: config.user, password: config.password};
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8','Authorization':"Bearer " + await getToken(data)}
    const res = await this.send(method, url, data , headers);
    return res
};     
    
export {user}
