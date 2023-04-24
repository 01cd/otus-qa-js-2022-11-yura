let data = JSON.parse(process.env.detectLNG)
export const config = {
 url: data.url,
 urlapi: data.urlapi,
 token: data.token,
 email: data.email,
 password: data.password
}
