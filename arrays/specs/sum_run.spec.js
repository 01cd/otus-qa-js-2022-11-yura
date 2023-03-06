import {TestData} from './data.js'
import {getScore} from '../src/app.js'

describe('test function getScore', () => {
    const test_data = TestData
    test.each(test_data)('input > score', ({type, data, expected}) => {
        if (type === 'success') {
            expect(getScore(data)).toBe(expected); // эти входные данные отработают, в том числе потому, что если не может сложить, то возвращает 0
        } else if (type === 'error') {
            expect(() => getScore(data)).toThrow(); // по этим данным вылетит
        } else {
            expect(getScore(data)).not.toBe(expected) // по этим входным данным вернёт неверно, потому что нет проверок
        }
    })
})
