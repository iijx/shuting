const md5 = require('md5');
const Utils = require('../lib/utils');
const PayConfig = require('../payConfig');
const PROD_ENV_NAME = 'prod-mxd6w';

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

module.exports = class Order {
    constructor(opt) {
        this.mchid = PayConfig.MCHID;
        this.openid = opt.openid;
        this.body = opt.body || '数听会员';
        this.total_fee = opt.total_fee;
        this.status = 1; // 1 未支付，2 已支付， 3，已退款
        this.out_trade_no = this.genOrderNum();
        this.transaction_id = ''; // 微信订单号
        this.payjs_order_id = ''; // payjs 订单号
        this.time_end =  ''; // 支付时间
        this.attach = opt.attach || ''; // 订单附带信息

        this.createAt = new Date();
        this.updateAt = new Date();
    }
    // 生成订单号
    genOrderNum() {
        return Utils.dateFormatter(new Date(), "YYYYMMDDHHmmss") + String(Date.now()).slice(-3) + randomIntegerInRange(100, 999);
    }
    // 转成payjs需要的订单对象
    getOrder2payjsDto(cloud_env) {
        let payOrder = {
            mchid: this.mchid, // 商户号
            total_fee: this.total_fee,
            out_trade_no: this.out_trade_no,
            body: this.body,
            notify_url: cloud_env === PROD_ENV_NAME ? PayConfig.NOTIFY_URL : PayConfig.NOTIFY_URL_DEV,
            nonce: String(Date.now()), // 随机字符串
        };
        console.log('cloud_env', cloud_env);
        console.log('payOrder', payOrder);
        return {
            ...payOrder,
            sign: md5(`body=${payOrder.body}&mchid=${payOrder.MCHID}&notify_url=${payOrder.notify_url}&out_trade_no=${payOrder.out_trade_no}&total_fee=${payOrder.total_fee}&key=${PayConfig.KEY}`).toUpperCase(),
        }
    }
}
