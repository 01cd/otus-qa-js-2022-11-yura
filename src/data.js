function prepareTestData() {
    let mb = "я 1 МиБ txt ";
    for (var i = 0; i < 16; i++) {
        mb=mb+mb
    }
    return [
        [777, "incorrect", "incorrect"],
        ["я строка текста", "incorrect", "incorrect"],
        [["я массив", 4, [2,"Б",8]], "incorrect","incorrect"],
        [{"я объект":3124321, 2:"ъъъ"}, "incorrect", "incorrect"],
        ["я строка с символами `~!@#№;$%^:?&*(-+)'\/,|<>}{\"", "incorrect", "incorrect"],
        [mb, "incorrect", "incorrect"],
        ["дедушка", "Я от дедушки ушёл", "incorrect"],
        ["заяц", "", "incorrect"],
        ["лиса", "Меня съели", "incorrect"],
        ["Дед Мороз", "incorrect", '"Дед Мороз! Дед Мороз! Дед Мороз!"'],
        ["Снегурочка", "incorrect", '"Снегурочка! Снегурочка! Снегурочка!"']
    ]
}

export {prepareTestData}