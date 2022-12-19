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

function newYear(name) {
  if (name == "Дед Мороз" || name == "Снегурочка") {
    return `"${name}! ${name}! ${name}!"`;
  } else {
	  return "incorrect" ;
	}  
}  

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

// зависимости и логи, уровни логирования: "fatal" (60); "error" (50); "warn" (40); "info"(30); "debug" (20); "trace" (10)
var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var fs = require('fs');
var prettyStdOut = new PrettyStream();
var prettyFileOut = new PrettyStream();
myFile = fs.createWriteStream('/var/log/1test.log');
prettyStdOut.pipe(process.stdout);
prettyFileOut.pipe(myFile);
var log = bunyan.createLogger({   
    name: 'test',
    streams: [        
                {
                    level:bunyan.INFO,
                    stream: prettyStdOut
                },
                {
                    path: '/var/log/1test.log',
                    level:bunyan.INFO,
                    useColor: false,
                    stream: prettyFileOut
                }
            ]
});

function test_kolobok() {
    log.info("\n Возвращаемые функцией kolobok значения:");
    var c = 0;
	for (var i = 0; i < test_data.length; i++) {
        c++;
        if ((i==6 && kolobok(test_data[i])==="Я от дедушки ушёл") || (i==7 && kolobok(test_data[i])==="") || (i==8 && kolobok(test_data[i])==="Меня съели")) {
            log.info("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
        } else if (i!=6 && i!=7 && i!=8 && kolobok(test_data[i])==="incorrect"){          
            log.warn("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
        } else {
            log.error("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+kolobok(test_data[i]));
        }
	}
	if (c != test_data.length) {
        log.error("error: test "+(c+1)+" failed");
    }
}

function test_newYear() {
    log.info("\n Возвращаемые функцией newYear значения:");
    var c = 0;
	for (var i = 0; i < test_data.length; i++) {
        c++;
        if ((i==9 && newYear(test_data[i])==="\"Дед Мороз! Дед Мороз! Дед Мороз!\"") || (i==10 && newYear(test_data[i])==="\"Снегурочка! Снегурочка! Снегурочка!\"")) {
            log.info("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
        } else if (i!=9 && i!=10 && newYear(test_data[i])==="incorrect"){
            log.warn("Тест №"+(i+1)+" из "+test_data.length+" ПРОЙДЕН "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
        } else {
            log.error("Тест №"+(i+1)+" из "+test_data.length+" НЕ пройден "+" ("+JSON.stringify(test_data[i])+")"+" > "+newYear(test_data[i]));
        }
	}
	if (c != test_data.length) {
        log.error("error: test "+(c+1)+" failed");         
    }
}

//запуск тестов
test_kolobok()
test_newYear()