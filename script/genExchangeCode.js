const fs = require('fs');

let codeArr = new Set();

let str = 'abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890';

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const randomChar = () => str[randomIntegerInRange(0, 58)];

const randomCode = () => {
    let code = ''
    for (let i = 0; i < 9; i++) {
        code += randomChar();
    }
    return code;
}

class ExchangeCode {
    constructor(opt) {
        this.code = opt.code;
        this.type = opt.type;
        
        this.status = 1;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}


for (let i = 0; i < 1000; i++) {
    codeArr.add(randomCode());
}
let result = Array.from(codeArr).map(item => new ExchangeCode({
    code: item,
    type: 3,
}));

for (const item of result) {
    fs.writeFileSync('./json/exchangeCode.json', JSON.stringify(item), {
        flag: 'a+'
    })
}

