//const crypto = require('crypto');

export function login_gena(prefix, min, max) {
    return prefix+Math.floor(Math.random()*(max-min)+min)
}

export function password_gena(lvl,length) {
    if (lvl < 1) {lvl = 1}
    if (lvl > 4) {lvl = 4}
    let result = '';
    let counter = 0;
    let length_n = Math.ceil(length / lvl);
    const charUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charlow = 'abcdefghijklmnopqrstuvwxyz';
    const charnum = '0123456789';
    const charsym = '@#$%^&*!;:~?.,№';
    const charUPLength = charUP.length;
    const charlowLength = charlow.length;
    const charnumLength = charnum.length;
    const charsymLength = charsym.length;
    while (counter < length_n) {
    if (lvl > 0) {
        result += charlow.charAt(Math.floor(Math.random() * charlowLength));
    }
    if (lvl > 1) {
        result += charUP.charAt(Math.floor(Math.random() * charUPLength));
    }
    if (lvl > 2) {
        result += charnum.charAt(Math.floor(Math.random() * charnumLength));
    }
    if (lvl > 3 && counter == 0) {
        result += charsym.charAt(Math.floor(Math.random() * charsymLength/2));
    } else if (lvl > 3) {
        result += charsym.charAt(Math.floor(Math.random() * charsymLength));        
    }
      counter += 1;
    }
    return result.substr(0, length);
}

export function uuid_gena() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    let uuid = [u.substr(0,8), u.substr(8,4), '4321-8' + u.substr(13,3), u.substr(16,12)].join('-');
    return uuid
}
