function kolobok(name) {
    if (typeof(name) !== "string") {
        throw new Error(`${JSON.stringify(name)} -> is not a string!`);
    }
    switch (name) {
        case "дедушка":
            return "Я от дедушки ушёл";
        case "заяц":
            return "";
        case "лиса":
            return "Меня съели";
        default:
            return "incorrect";
    }
}

function newYear(name) {
    if (typeof(name) !== "string") {
        throw new Error(`${JSON.stringify(name)} -> is not a string!`);
    }
    if (name == "Дед Мороз" || name == "Снегурочка") {
        return `"${name}! ${name}! ${name}!"`;
    }
        return "incorrect" ;
}

export {kolobok, newYear}