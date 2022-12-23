/**
 * Подсчёт суммы элементов объекта одним из способов
 * Предполагаем, что баллы в массиве должны быть от какой-то системы оценки => добавлены assert'ы для проверки на натуральные числа или 0 и ограничение на максимальный балл
 *
 * @param {obj} obj - массив с данными
 * @param {string} add - необязательный параметр для выбора способа подсчёта
 * @returns {number}
*/
import {strict as assert} from 'node:assert';

function sumObj(obj,add) {
	if (typeof(obj) !== 'object' || Array.isArray(obj) || obj === null || JSON.stringify(obj) == JSON.stringify({})) {
		throw new Error(`${JSON.stringify(obj)} -> is not a object!`);
	}
    let sum = 0;
    switch (add) {
        case "keys":
		Object.keys(obj).forEach(function(key){
			if (typeof(obj[key])!=="number" || isNaN(obj[key])) {
				throw new Error(`value of "${key}" -> is not a number`);
			}
      			assert.strictEqual(obj[key], parseInt(obj[key]),"points should be integer!");
      			assert(obj[key] >= 0, "points should be positive!");
      			assert(obj[key] < 10000, "points should not be over 9999!");
			sum=sum+obj[key]
		})
		return sum
        case "map":
                let m = 0;
		return Object.values(obj).map(function(val) {
			if (typeof(val)!=="number" || isNaN(val))  {
    				throw new Error(`value ${JSON.stringify(val)} -> is not a number`);
			}
      			assert.strictEqual(val, parseInt(val),"points should be integer!");
      			assert(val >= 0, "points should be positive!");
      			assert(val < 10000, "points should not be over 9999!");
			return m=m+val})[Object.values(obj).length-1]				
        case "redu":
            	return Object.values(obj).reduce(function(acc, val) {
			if (typeof(val)!=="number" || isNaN(val))  {
				throw new Error(`value ${JSON.stringify(val)} -> is not a number`);
			}
			assert.strictEqual(val, parseInt(val),"points should be integer!");
      			assert(val >= 0, "points should be positive!");
      			assert(val < 10000, "points should not be over 9999!");
			return acc + val}, 0)
        default:
		for (var prop in obj) {
			if (typeof(obj[prop])!=="number" || isNaN(obj[prop]))  {
				throw new Error(`value of "${prop}" -> is not a number`);
 			}
			assert.strictEqual(obj[prop], parseInt(obj[prop]),"points should be integer!");
      			assert(obj[prop] >= 0, "points should be positive!");
      			assert(obj[prop] < 10000, "points should not be over 9999!");
			sum=sum+obj[prop]
			}	
		return sum
	}
}

export {sumObj}