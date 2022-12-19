function kolobok(name) {
    if (typeof(name) == 'string') {
        var ss = 0;
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

//первая функция работает, но мне удобнее так в данном случае:
/*const actions = {
"дедушка":"Я от дедушки ушёл",
"заяц":"",
"лиса":"Меня съели"
}

function kolobok(name) {
	if (actions[name]) {
    return actions[name];
	} else {
		return "incorrect: " + JSON.stringify(name)
	}
} */

// по дефолту вылетает с ошибкой: 'tale.js': line: 41, message: SyntaxError: Expected token `;'   --В node 14.21 работает
function newYear(name) {
  if (name == "Дед Мороз" || name == "Снегурочка") {
    return `"${name}! ${name}! ${name}!"`;
  } else {
	  return "incorrect" ;
	}  
}  

// аналог, который работает везде
/*function newYear(name) {
  if (name == "Дед Мороз" | name == "Снегурочка") {
    return string_format(['{2}{1}{3} {1}{3} {1}{3}{2}', name,"\"", "!"]);
	} else {
	  return "incorrect: " + JSON.stringify(name);
	}  
}

function string_format(array) {
  var s = array[0];
  for (var i = 1; i < array.length; i++) {
    s = s.replace(RegExp("\\{" + i + "\\}","gm"), array[i]);
  }
  return s;
}*/

//данные в тесты
let test_data=[];
var mb = "я 1 МиБ txt ";
for (i = 0; i < 16; i++) {mb=mb+mb}
test_data.push(777); // #1
test_data.push("я строка текста"); // #2
test_data.push(["я массив", 4, [2,"Б",8]]); // #3
test_data.push({"я объект":3124321, 2:"ъъъ"}); // #4
test_data.push("я строка с символами `~!@#№;$%^:?&*(-+)'\/,|<>}{\""); // #5
test_data.push(mb); // #6
test_data.push("дедушка"); // #7
test_data.push("заяц"); // #8
test_data.push("лиса"); // #9
test_data.push("Дед Мороз"); // #10
test_data.push("Снегурочка"); // #11

// зависимости и логи
var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: 'test',
    streams: [{
        path: '/var/log/1test.log',
        level:bunyan.INFO
    }]
});

//тест колобка
function test_kolobok() {
	//console.log("Возвращаемые функцией kolobok значения:");
    log.info("Возвращаемые функцией kolobok значения:");
    var c = 0;
	for (var i = 0; i < test_data.length; i++) {
        c++;
        if ((i==6 && kolobok(test_data[i])==="Я от дедушки ушёл") || (i==7 && kolobok(test_data[i])==="") || (i==8 && kolobok(test_data[i])==="Меня съели")) {
            log.warn("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
            //console.log("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
        } else if (i!=6 && i!=7 && i!=8 && kolobok(test_data[i])==="incorrect"){          
            log.info("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
            //console.log("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
        } else {
            log.warn("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
            //console.log("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
        }
	}
	if (c != test_data.length) {
        log.warn("error: test "+(c+1)+" failed");
    }
}

//тест нового года
function test_newYear() {
	//console.log("Возвращаемые функцией newYear значения:");
    log.info("Возвращаемые функцией newYear значения:");
    var c = 0;
	for (var i = 0; i < test_data.length; i++) {
        c++;
        if ((i==9 && newYear(test_data[i])==="\"Дед Мороз! Дед Мороз! Дед Мороз!\"") || (i==10 && newYear(test_data[i])==="\"Снегурочка! Снегурочка! Снегурочка!\"")) {
            log.warn("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
            //console.log("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
        } else if (i!=9 && i!=10 && newYear(test_data[i])==="incorrect"){
            log.info("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
            //console.log("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
        } else {
            log.warn("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
            //console.log("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i])); 
        }
	}
	if (c != test_data.length) {
        log.warn("error: test "+(c+1)+" failed");         
    }
}

//запуск тестов
test_kolobok()
test_newYear()