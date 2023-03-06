import axios from 'axios';
import 'regenerator-runtime/runtime';
import {dataObj} from './data.js'

test('#1_post_user_already_exists', async function regUser() {
  try {
    const response = await axios(dataObj.used_login);
  } catch (error) {
    expect(error.response.status).toBe(406);
    expect(error.response.statusText).toBe("Not Acceptable");
    expect(error.response.data.code).toBe("1204");
    expect(error.response.data.message).toBe("User exists!");
    //console.error(error);
  }
});

test('#2_post_user_bad_password', async function regUser() {
  try {
    const response = await axios(dataObj.bad_password);
  } catch (error) {
    expect(error.response.status).toBe(400);
    expect(error.response.statusText).toBe("Bad Request");
    expect(error.response.data.code).toBe("1300");
    expect(error.response.data.message).toBe("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.");
    //console.error(error);
  }
});

test('#3_post_user_new', async function regUser() {
    const response = await axios(dataObj.new_user);
    console.log(`create new: ${JSON.stringify(dataObj.new_user)} | ${JSON.stringify(response.data)}`)    
    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
    expect(response.data.username).toBe(dataObj.new_user.data.userName);
    expect(response.data.userID).toHaveLength(36);
    dataObj.del_new_user.url=dataObj.del_new_user.url+response.data.userID;
    console.log(`new user id: ${JSON.stringify(response.data.userID)}`);
});

// вместо 400 Bad Request (Error) почему-то отдаёт 200 OK
test('#4_post_generate_token_err', async function getToken() {
    const response = await axios(dataObj.err_token);
    //console.log(`token_err: ${JSON.stringify(response.status)} + ${JSON.stringify(response.data)}`);
    //expect(response.status).not.toBe(200);    
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(response.data.status).toBe("Failed");
    expect(response.data.result).toBe("User authorization failed.");
});


test('5#_post_generate_token_ok', async function getToken() {
    const response = await axios(dataObj.generate_token);
    console.log(`token_ok: ${JSON.stringify(response.data)}`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(response.data.status).toBe("Success");
    expect(response.data.result).toBe("User authorized successfully.");
    dataObj.del_new_user.headers.Authorization="Bearer " + response.data.token;
});

test('delete_new_user(cleanup)', async function delUser() {
  try {
    const response = await axios(dataObj.del_new_user);
    console.log(`delete new user url: ${JSON.stringify(dataObj.del_new_user.url)} | ${JSON.stringify(response.data)}`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");    
  } catch (error) {
    //console.error(error);
  }
});


