let data = JSON.parse(process.env.credentials)
export const config = {
 url: "https://bookstore.demoqa.com/",
 user: data.user,
 password: data.password,
 userID: data.userID,
 token: data.token,
}
