function longObj(){
    let b = {};
    for (var i=0; i<10000; i++) {
        b["key"+i]=i;  
    }
    return b
}

function textMB(){    
    let mb = "я 1 МиБ txt ";
	for (var i = 0; i < 16; i++) {
		mb=mb+mb
	}
	return mb
}

function myFunc() {    
}

const emptyArr = [,,];

export const TestData = [
    {
        type: 'success', // №1
        data: {Anna: 10, Olga: 1, Ivan: 5}, // данные для теста
        expected: 16 // что ожидаем получить
    },
    {
        type: 'success', // №2
        data: {Anna: 1, Raya: 10, Vera: 100, Elena: 1000, Nina: 10000}, // данные для теста
        expected: 11111 // что ожидаем получить
    },
    {
        type: 'success', // №3
        data: {key1: 3, key2: -2}, // данные для теста
        expected: 1 // что ожидаем получить
    },
    {
        type: 'success', // №4
        data: {key1: 7, key2: 0}, // данные для теста
        expected: 7 // что ожидаем получить
    },
    {
        type: 'wrong', // №5
        data: {key1: '10', key2: 5}, // данные для теста
        expected: 15 // что ожидаем получить
    },
    {
        type: 'wrong', // №6
        data: {key1: 4, key2: ""}, // данные для теста
        expected: 4 // что ожидаем получить
    },
    {
        type: 'wrong', // №7
        data: {key1: NaN, key2: 6}, // данные для теста
        expected: 6 // что ожидаем получить
    },
    {
        type: 'wrong', // №8
        data: {key1: 8, key2: undefined}, // данные для теста
        expected: 8 // что ожидаем получить
    },
    {
        type: 'wrong', // №9
        data: {key1: 9, key2: {points: 5}}, // данные для теста
        expected: 9 // что ожидаем получить
    },
    {
        type: 'success', // №10
        data: new myFunc(), // данные для теста
        expected: 0 // что ожидаем получить
    },
    {
        type: 'success', // №11
        data: false, // данные для теста
        expected: 0 // что ожидаем получить
    },
    {
        type: 'success', // №12
        data: 100, // данные для теста
        expected: 0 // что ожидаем получить
    },
    {
        type: 'success', // №13
        data: {}, // данные для теста
        expected: 0 // что ожидаем получить
    },
    {
        type: 'error', // №14
        data: emptyArr[0], // данные для теста
        expected: 0 // что ожидаем получить
    },
    {
        type: 'error', // №15
        data: null, // данные для теста
        expected: 0 // что ожидаем получить
    },
    {
        type: 'success', // №16
        data: longObj(), // данные для теста
        expected: 49995000 // что ожидаем получить
    },
    {
        type: 'wrong', // №17
        data: textMB(), // данные для теста
        expected: 0 // что ожидаем получить
    }
]
//посчитать сумму для сгенерированного объекта
/*
function fn(min, max, step) {
  var n = (max - min) / step | 0;
  return (min + n * step / 2) * ++n;
};
console.log(fn(0,9999,1));
*/
