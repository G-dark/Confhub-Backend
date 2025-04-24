import {jest} from "@jest/globals";
import {dateToString, generateRandomId} from '../src/Utils/tools.js'


test('convertir fecha en texto',()=>{
    expect(dateToString(new Date('2025-04-22T05:03:00'))).toBe("2025-04-22 05:03:00")
})
