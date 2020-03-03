// 云函数入口文件
const cloud = require('wx-server-sdk')
var md5 = require('md5');
cloud.init()

// 云函数入口函数
const MCHID = '1578310381'; // 商户号
const KEY = '21Snj9vJUxL4QmyF'; // 密钥

const dateFormatter = (date, formatter) => {
    date = date ? new Date(date) : new Date();
    const Y = date.getFullYear() + '',
          M = date.getMonth() + 1,
          D = date.getDate(),
          H = date.getHours(),
          m = date.getMinutes(),
          s = date.getSeconds()
    return formatter.replace(/YYYY|yyyy/g, Y)
                    .replace(/YY|yy/g, Y.substr(2, 2))
                    .replace(/MM/g, (M < 10 ? '0' : '') + M)
                    .replace(/DD/g, (D < 10 ? '0' : '') + D)
                    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
                    .replace(/mm/g, (m < 10 ? '0' : '') + m)
                    .replace(/ss/g, (s < 10 ? '0' : '') + s)
}

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const price1 = 290;
const price2 = 480;

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { memberType } = event;
    if (!memberType) return {}

    const totalFee = memberType === "1" ? price1 : price2;

    const outTradeNo = dateFormatter(new Date(), "YYYYMMDDHHmmss") + String(Date.now()).slice(-3) + randomIntegerInRange(100, 999);

    const sign = md5(`mchid=${MCHID}&out_trade_no=${outTradeNo}&total_fee=${totalFee}&key=${KEY}`).toUpperCase();

    return {
        'mchid': MCHID, // 商户号
        'total_fee': totalFee,
        'out_trade_no': outTradeNo,
        'body': '测试购买',
        'notify_url':  '',
        'attach': '{}',
        'nonce': '1234',
        'sign': sign
    }
}