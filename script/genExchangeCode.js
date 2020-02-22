let codeArr = [];

let str = 'abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890';

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const randomChar = () => str[randomIntegerInRange(0, 58)];

const randomCode = () => {
    let code = ''
    for (let i = 0; i < 6; i++) {
        code += randomChar();
    }
    return code;
}

for (let i = 0; i < 1000; i++) {
    codeArr.push(randomCode());
}

(async () => {
    let c_code = db.collection('exchange_code');
    for (const code of codeArr) {
        await c_code.add({
            data: new ExchangeCode({
                code,
                type: 1,
                status: 1
            })
        })
    }
})

class ExchangeCode {
    constructor(opt) {
        this.code = opt.code;
        this.type = opt.type;
    }
}
