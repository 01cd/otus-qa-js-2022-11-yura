import {user} from '../framework/services/data.js';
const fs = require("fs").promises;
var content = false;

async function read () {
    try{
        const result = await fs.readFile("/tmp/user.txt", "utf8")
        //console.log("read_res: "+result)
        return result
    } catch (err) {
        console.error("read_error: "+err)
    };
}

async function write () { 
        await fs.writeFile("/tmp/user.txt", JSON.stringify(content), "utf8", (err) => {if (err) console.error("write failed: "+err)});
    }    

    
describe('#1_test_user_authorization', () => {
    test('test_wrong_user', async function authUser() {
        try {
            const response = await user.auth({userName:"uh3ew",password:"8329uierkdw"});
            expect(response.status).toBe(404);
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(404);
            expect(error.response.statusText).toBe("Not Found");
            expect(error.response.data.code).toBe("1207");
            expect(error.response.data.message).toBe("User not found!");
        }
    });
    test('test_right_user', async function authUser() {
        try {
            const response = await user.auth();
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(200);
        }
    });
    test('test_no_user', async function authUser() {
        try {
            const response = await user.auth({userName:"",password:"8329uierkdw"});
            expect(response.status).toBe(400);
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("UserName and Password required.");
        }
    });
});

describe('#2_test_user_deletion', () => {
    test('#test_user_from_file', async function delUser() {
        try {
            let readfile = await read();
            if (typeof readfile === "string") {
                readfile = JSON.parse(readfile);
            } else {
                throw new Error()
            }
            const response = await user.delete({userName: readfile.userName, password: readfile.password},readfile.userID);
            expect(response.status).toBe(204);
            expect(response.statusText).toBe("No Content");    
        } catch (error) {
            //console.error(error);
            expect(error).toBeDefined(); 
        }
    });
    test('#test_user_random_data', async function delUser() {
        try {            
            const response = await user.delete();
            expect(response.status).toBe(200);   
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(200);
            expect(error.response.statusText).toBe("OK");
            expect(error.response.data.code).toBe("1207");
            expect(error.response.data.message).toBe("User Id not correct!");   
        }
    });
    test('#test_user_bad_data', async function delUser() { //выдаёт html вместо кода и текста ошибки
        try {            
            const response = await user.delete({user:"",password:"U#*GY&82yfd"});
            expect(response.status).toBe(400);   
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request"); 
        }
    });
    test('#test_user_wrong_data', async function delUser() {
        try {            
            const response = await user.delete({userName:"userN10654",password:"vQ8%vY4@eV"},"175af70e-9c8f-4c06-8816-556b866ee7f3");
            expect(response.status).toBe(401);   
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("User not authorized!");   
        }
    });
});

describe('#3_test_user_info', () => {
    test('#test_right_user_info', async function getUser() {
        try {
            const response = await user.info();
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(response.data.userId).toHaveLength(36);
            expect(response.data).toHaveProperty('username');
            expect(response.data).toHaveProperty('books');
        } catch (error) {
            //console.error(error);            
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("User not authorized!"); 
        }
    });
    test('#test_wrong_user_info', async function getUser() {
        try {
            const response = await user.info({userName:"uh3ew",password:"83^$DFerkdw"});
            expect(response.status).toBe(401);
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("User not authorized!");         
        }
    });
    test('#test_deleted_user_info', async function getUser() {
        try {
            const response = await user.info({userName:"uh3ewhDB55",password:"83^$DFerkdw"},"1ab11250-e3c2-4942-ba84-5e0cb5f3800b");
            expect(response.status).toBe(401);
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1207");
            expect(error.response.data.message).toBe("User not found!");         
        }
    });    
});

test('#4_test_user_creation', async function regUser() {
  try {
    const response = await user.create();
    expect(response[0].status).toBe(201);
    expect(response[0].statusText).toBe("Created");
    expect(response[0].data).toHaveProperty("username");
    expect(response[0].data.userID).toHaveLength(36);
    //console.log(`new user id: ${JSON.stringify(response[0].data.userID)}`);
    content = response[1];
    content.userID=response[0].data.userID
    console.log(`new user data: ${JSON.stringify(content)}`);    
    await write()
  } catch (error) {
    console.error(error);
    console.error("User not created! Try again")
    expect(error.response.status).toBe(400);
    expect(error.response.statusText).toBe("Bad Request");
    expect(error.response.data.code).toBe("1300");
    expect(error.response.data.message).toBe("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer."); 
  }
});

test('#5_test_token_generation', async function getToken() {
    try {    
    let readfile = await read();   
    console.log("read_result: "+readfile)
    let response = true
    if (typeof readfile === "string") {
        readfile = JSON.parse(readfile);
        response = await user.token({userName: readfile.userName, password: readfile.password});
    } else {
        response = await user.token();
    }
    console.log(`token: ${JSON.stringify(response.data)}`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(response.data.status).toBe("Success");
    expect(response.data.result).toBe("User authorized successfully.");
  } catch (error) {
    //console.error(error);    
    expect(error.response.data.status).toBe("Failed");
    expect(error.response.data.result).toBe("User authorization failed.");
  }
});
