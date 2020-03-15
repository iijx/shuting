// 云函数入口文件
const cloud = require('wx-server-sdk')
const PayConfig = require('./payConfig');
var md5 = require('md5');
const goods =  [
    {
        name: '月度会员 · 30天',
        isRecommend: false,
        price: 2.9,
        oldPrice: 10,
        memberType: 1,
        rank: 1,
    },
    // {
    //     name: '半年会员 · 180天',
    //     isRecommend: false,
    //     price: 7.8,
    //     oldPrice: 19,
    //     memberType: 2,
    //     rank: 2,
    // },
    {
        name: '终身会员 · 100年',
        isRecommend: true,
        price: 9.7,
        oldPrice: 68,
        memberType: 3,
        rank: 3,
    },
];


// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
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

const genOrder = async function(openid, memberType) {
    let total_fee = 0;
    try {
        total_fee = parseInt(goods.find(item => String(item.memberType) === String(memberType)).price * 100);
    } catch (error) {
        total_fee = 970;        
    };
    const order = new Order({
        total_fee, 
        openid,
    });

    const res = await db.collection('order').add({
        data: order
    })
    console.log(res)
    return order;
} 
// const price2 = 2;

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { memberType } = event;
    if (!memberType) return {}

    const order = await genOrder(wxContext.OPENID, memberType)

    return order.getOrder2payjsDto();
};

class Order {
    constructor(opt) {
        this.mchid = PayConfig.MCHID;
        this.openid = opt.openid;
        this.total_fee = opt.total_fee;
        this.status = 1; // 1 未支付，2 已支付， 3，已退款
        this.out_trade_no = this.genOrderNum();
        this.transaction_id = ''; // 微信订单号
        this.payjs_order_id = ''; // payjs 订单号
        this.time_end =  ''; // 支付时间

        this.created = new Date();
        this.updated = new Date();
    }
    genOrderNum() {
        return dateFormatter(new Date(), "YYYYMMDDHHmmss") + String(Date.now()).slice(-3) + randomIntegerInRange(100, 999);
    }
    getOrder2payjsDto() {
        let payOrder = {
            mchid: this.mchid, // 商户号
            total_fee: this.total_fee,
            out_trade_no: this.out_trade_no,
            notify_url: PayConfig.NOTIFY_URL,
            nonce: "1234"
        };
        return {
            ...payOrder,
            sign: md5(`mchid=${payOrder.MCHID}&out_trade_no=${payOrder.out_trade_no}&total_fee=${payOrder.total_fee}&key=${PayConfig.KEY}`).toUpperCase(),
        }
    }
}