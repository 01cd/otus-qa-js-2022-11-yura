import axios from 'axios';
import {login_gena, password_gena, uuid_gena} from '../fixtures/gens.js';
import {config} from '../config/config.js';
    
let token = false;    

const user = {
    send: (method, url, data, headers) => {
        let toSend={};
        toSend.method = (method) ? method : "post";
        toSend.url = config.url + ((url) ? url : "Account/v1/Authorized");
        toSend.data = (data) ? data : {"userName": config.user, "password": config.password};
        toSend.headers = (headers) ? headers : {'Accept': '*/*', 'Content-Type': 'application/json; charset=utf-8'};
        console.log("url: "+toSend.url)
        console.log("credentials: "+JSON.stringify(toSend.data))
        return axios(toSend)
    }    
};
    
user.create = async function (data) { //из-за багов в сайте может не всегда создаваться (например, не воспринимает '~' или '№' как символ в пароле)
    let method = 'post';
    let url = 'Account/v1/User';
    data = (data) ? data : {"userName": login_gena("userN",666,66666), "password": password_gena(4,10)};
    const res = await this.send(method, url, data);
    return [res,data]
};    
user.auth = async function (data) {
    let method = 'post';
    let url = 'Account/v1/Authorized';
    data = (data) ? data : {"userName": config.user, "password": config.password};
    const res = await this.send(method, url, data);
    return res
}; 
user.token = async function (data) {
    if (this.lastToken) {
        return this.lastToken
    }
    let method = 'post';
    let url = 'Account/v1/GenerateToken';
    data = (data) ? data : {"userName": config.user, "password": config.password};
    const res = await this.send(method, url, data);
    if (res.data.token) {
        this.lastToken=res.data.token;
        console.log("token: "+this.lastToken);
    }
    return res.data.token
};
user.delete = async function (data,userID,token) { // если не подали данные, то генерируем новые, чтобы получить ошибку по авторизации
    let method = 'delete';
    userID = (userID) ? userID : uuid_gena();
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            console.log("del_token: "+token);
            return token        
        } else if (!token && !data) {
            return uuid_gena()
        }
        return token    
    };
    let url = 'Account/v1/User/'+userID;
    data = (data) ? data : {"userName": login_gena("userB",666,66666), "password": password_gena(4,10)};
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
            return token            
        } else if (!token && !data) {
            return config.token
        }
        return token    
    };
    let url = 'Account/v1/User/'+userID;
    data = (data) ? data : {"userName": config.user, "password": config.password};
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8','Authorization':"Bearer " + await getToken(data)}
    const res = await this.send(method, url, data , headers);
    return res
};   

const books = {
    send: (method, url, data, headers, params) => {
        let toSend={};
        toSend.method = (method) ? method : "get";
        toSend.url = config.url + ((url) ? url : "BookStore/v1/Books");
        toSend.data = (data) ? data : {};
        toSend.headers = (headers) ? headers : {'Accept': '*/*', 'Content-Type': 'application/json; charset=utf-8'};
        toSend.params = (params) ? params : {};
        console.log("url: "+toSend.url)
        console.log("data: "+JSON.stringify(toSend.data))        
        return axios(toSend)
    }
}
books.getBooks = async function () {
    let method = 'get';
    let url = 'BookStore/v1/Books';
    const res = await this.send(method, url, {});
    return res
};
books.getBook = async function (data,params) {
    let method = 'get';
    let url = 'BookStore/v1/Book';
    data = (data) ? data : {"userName": config.user, "password": config.password};
    params = (params) ? params : {"ISBN":"9781449365035"};
    const res = await this.send(method, url, {}, null, params);
    return res
};
books.addBook = async function (data,databook,userID,token) {
    let method = 'post';
    let url = 'BookStore/v1/Books';
    userID = (userID) ? userID : config.userID;
    data = (data) ? data : {"userName": config.user, "password": config.password};
    databook = (databook) ? databook : {"userId": userID, "collectionOfIsbns": [{"isbn": "9781449325862"},{"isbn": "9781449331818"}]};
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            return token            
        } else if (!token && !data) {
            return config.token
        }
        return token    
    };
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8','Authorization':"Bearer " + await getToken(data)};
    const res = await this.send(method, url, databook, headers);
    return res
};
books.updateBook = async function (data,databook,userID,token,isbn,isbnNew) {
    let method = 'put';
    let url = `BookStore/v1/Books/${isbn}`;
    userID = (userID) ? userID : config.userID;
    data = (data) ? data : {"userName": config.user, "password": config.password};
    isbn = (isbn) ? isbn : "9781449325862";
    isbnNew = (isbnNew) ? isbnNew : "9781449331818";
    databook = (databook) ? databook : {"userId": userID, "isbn": isbnNew};
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            return token            
        } else if (!token && !data) {
            return config.token
        }
        return token    
    };
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8','Authorization':"Bearer " + await getToken(data)};
    const res = await this.send(method, url, databook, headers);
    return res
};
books.deleteBook = async function (data,databook,userID,token,isbn) {
    let method = 'delete';
    let url = 'BookStore/v1/Book';
    userID = (userID) ? userID : config.userID;
    data = (data) ? data : {"userName": config.user, "password": config.password};
    databook = (databook) ? databook : {"isbn": isbn, "userId": userID};
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            return token            
        } else if (!token && !data) {
            return config.token
        }
        return token    
    };
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8','Authorization':"Bearer " + await getToken(data)};
    const res = await this.send(method, url, databook, headers);
    return res
};
books.deleteBooks = async function (data,userID,token) {
    let method = 'delete';
    let url = 'BookStore/v1/Books';
    userID = (userID) ? userID : config.userID;
    let getToken = async function (data) {
        if (!token && data) {
            token = await user.token(data);
            return token            
        } else if (!token && !data) {
            return config.token
        }
        return token    
    };
    let headers = {'Accept': "*/*", 'content-type': 'application/json; charset=utf-8','Authorization':"Bearer " + await getToken(data)};
    let params = {"UserId": userID};
    const res = await this.send(method, url, {}, headers, params);
    return res
};
    
export {user}
export {books}
