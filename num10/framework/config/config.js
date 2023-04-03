let data = JSON.parse(process.env.credentials)
export const config = {
 url: data.url,
 user: data.user,
 password: data.password,
 userID: data.userID,
 token: data.token,
}
