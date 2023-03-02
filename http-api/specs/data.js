function login_gena() {
    return "usert!"+Math.floor(Math.random()*(66666-6666)+6666)
}
function password_gena() {
    let result = '';
    let counter = 0;
    let length = 3;
    const charUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charlow = 'abcdefghijklmnopqrstuvwxyz';
    const charnum = '0123456789';
    const charsym = '!@#$%^&*;:~*?.,№';
    const charUPLength = charUP.length;
    const charlowLength = charlow.length;
    const charnumLength = charnum.length;
    const charsymLength = charsym.length;
    counter = 0;
    while (counter < length) {
      result += charUP.charAt(Math.floor(Math.random() * charUPLength));
      result += charlow.charAt(Math.floor(Math.random() * charlowLength));
      result += charnum.charAt(Math.floor(Math.random() * charnumLength));
      result += charsym.charAt(Math.floor(Math.random() * charsymLength));
      counter += 1;
    }
    return result;
}

const password = JSON.parse(JSON.stringify(password_gena()));
const name = JSON.parse(JSON.stringify(login_gena()));

export const dataObj = {
    bad_password: {method: 'post',
        url: 'https://bookstore.demoqa.com/Account/v1/User',
        data: {
    	    userName: 'user',
            password: 'password'
        }
    },
    used_login: {method: 'post',
        url: 'https://bookstore.demoqa.com/Account/v1/User',
        data: {
            userName: 'user',
            password: password
        }
    },
    new_user: {method: 'post',
        url: 'https://bookstore.demoqa.com/Account/v1/User',
        data: {
            userName: name,
            password: password
        }
    },
    del_new_user: {method: 'delete',
        url: 'https://bookstore.demoqa.com/Account/v1/User/',
        data: {
            userName: name,
            password: password
        }
    },
     err_token: {method: 'post',
        url: 'https://bookstore.demoqa.com/Account/v1/GenerateToken',
        data: {
            userName: 'user',
            password: 'password'
        }
    },
     generate_token: {method: 'post',
        url: 'https://bookstore.demoqa.com/Account/v1/GenerateToken',
        data: {
            userName: name,
            password: password
        }
    },
    userID: ""
}
