import {prepareTestData} from './data.js'
import {getScore} from '../src/app.js'

describe('test function getScore', () => {
    const test_data = prepareTestData()
    let i=0;
    test.each(test_data)('input > score', (a,b) => {
        i++;
        if (i < 5 || (i > 9 && i < 14) || i == 16) { // эти входные данные отработают, в том числе потому, что если не может сложить, то возвращает 0
            expect(getScore(a)).toBe(b);
        } else if (i > 13 && i < 16) {
            expect(() => getScore(a)).toThrow(); // по этим данным вылетит
        } else {
            expect(getScore(a)).not.toBe(b) // по этим входным данным вернёт неверно, потому что нет проверок
        }
    })
})
