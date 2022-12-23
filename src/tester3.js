function test(log, func, data, index) {
    let i = 0
    for (var eleOfArray of data) {
        ++i
        try {
            const result = func(eleOfArray[0])
            if (result == eleOfArray[index]) {
                log.info(`Тест №${i} ПРОЙДЕН (${eleOfArray[0]}) -> ${result}`)
            } else {
                log.warn(`Тест №${i} НЕ ПРОЙДЕН (${eleOfArray[0]}) -> ${result}`)
            }
        } catch (error) {
            log.fatal(`Тест №${i} УПАЛ: ${error}`)
        }
    }
}

export {test}