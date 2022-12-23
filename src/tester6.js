function test(log, func, data, index) {
	let i = 0
	data.forEach(function(ele){
		++i
		try{
			let start = new Date();
			const result = func(ele[0],index)
			if (result[0] === ele[1]) {
				log.info(`Тест №${i} пройден -> сумма ожидаемая ${ele[1]} = сумма полученная ${result[0]}; запрос отработал за ${result[1]-start}ms`)
			} else {
				log.warn(`Тест №${i} НЕ ПРОЙДЕН -> сумма ожидаемая ${ele[1]} и сумма полученная ${result[0]}; запрос отработал за ${result[1]-start}ms`)
			}
		} catch (error) {
			log.fatal(`Тест №${i} ОШИБКА: ${error}`)
		}
	})
}

export {test}