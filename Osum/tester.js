function test(log, func, data, index) {
	let i = 0
	data.forEach(function(ele){
		++i
		try{
			const result = func(ele[0],index)
			if (result === ele[1]) {
				log.info(`Тест №${i} пройден -> сумма ожидаемая ${ele[1]} = сумма полученная ${result}`)
			} else {
				log.warn(`Тест №${i} НЕ ПРОЙДЕН -> сумма ожидаемая ${ele[1]} и сумма полученная ${result}`)
			}
		} catch (error) {
			log.fatal(`Тест №${i} ОШИБКА: ${error}`)
		}
	})
}

export {test}