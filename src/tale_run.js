// зависимости 
import {createWriteStream} from 'fs'
import PrettyStream from 'bunyan-prettystream';
import bunyan from 'bunyan'
import {kolobok, newYear} from './tale.js'
import {test} from './tester3.js'
import {prepareTestData} from './data3.js'

//данные в тесты
const test_data = prepareTestData()

//логирование (два стрима: консоль и файл)
function createLogger(fileName) {
    var prettyStdOut = new PrettyStream();
    var prettyFileOut = new PrettyStream();
    var myFile = createWriteStream(fileName);
    prettyStdOut.pipe(process.stdout);
    prettyFileOut.pipe(myFile);
    let log = bunyan.createLogger({
        name: 'test',
        streams: [
                    {
                        level:bunyan.INFO,
                        stream: prettyStdOut
                    },
                    {
                        path: fileName,
                        level:bunyan.INFO,
                        useColor: false,
                        stream: prettyFileOut
                    }
                ]
    });
    return log
}

// уровни логирования: "fatal" (60); "error" (50); "warn" (40); "info"(30); "debug" (20); "trace" (10)
const log = createLogger('/var/log/1test.log')
log.info("\n Возвращаемые функцией kolobok значения:");
test(log, kolobok, test_data, 1)
log.info("\n Возвращаемые функцией newYear значения:");
test(log, newYear, test_data, 2)