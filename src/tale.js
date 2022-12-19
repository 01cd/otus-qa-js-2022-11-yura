function kolobok(name) {
    let ss;
    if (typeof(name) == 'string') {
        switch (name) {
            case "дедушка":
                ss="Я от дедушки ушёл";
                break;
            case "заяц":
                ss="";
                break;
            case "лиса":
                ss="Меня съели";
                break;
            default:
                ss="incorrect";
        }
    } else {
        ss="incorrect"; //incorrect type
    }
    return ss;
}

function newYear(name) {
    if (name == "Дед Мороз" || name == "Снегурочка") {
        return `"${name}! ${name}! ${name}!"`;
    } else {
        return "incorrect" ;
    }
}

export {kolobok, newYear}