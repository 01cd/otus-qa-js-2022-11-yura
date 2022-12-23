// зависимости 
import {createWriteStream} from 'fs'
import PrettyStream from 'bunyan-prettystream';
import bunyan from 'bunyan';
import {strict as assert} from 'node:assert';
import {sumObj} from './sum_scores.js'
import {test} from './tester.js'
import {prepareTestData} from './data.js'

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
const log = createLogger('/var/log/1test.log');
log.info("\n Функция sumObj default");
test(log, sumObj, test_data);
log.info("\n Функция sumObj keys");
test(log, sumObj, test_data, "keys");
log.info("\n Функция sumObj map");
test(log, sumObj, test_data, "map");
log.info("\n Функция sumObj redu");
test(log, sumObj, test_data, "redu")
