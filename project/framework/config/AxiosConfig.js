export default class {
    constructor(        
        verAPI = "0.2",
        headers = {'Accept': '*/*'},
        timeout = 2000,
        withCredentials = false,
        responseType = "json",
        responseEncoding = "utf8",
        maxContentLength = 7000,
        maxBodyLength = 1000,
        maxRedirects = 1) {          
        this.verAPI = verAPI;
        this.headers = headers;              
        this.timeout = timeout;
        this.withCredentials = withCredentials;
        this.responseType = responseType;
        this.responseEncoding = responseEncoding;
        this.maxContentLength = maxContentLength;
        this.maxBodyLength = maxBodyLength;
        this.maxRedirects = maxRedirects;
    }
}
