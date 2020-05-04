// 云函数入口文件
const cloud = require('wx-server-sdk')
const PayConfig = require('./payConfig');
var md5 = require('md5');
const PROD_ENV_NAME = 'prod-mxd6w';
const GOODS =  [
    {
        title: '数听自定义天数会员',
        memberType: '10',
        isCustom: true,
    },
    {
        title: '数听月度会员',
        price: 2.9,
        totalFee: 290,
        memberType: 1,
        memberDay: 30,
    },
    {
        title: '数听半年会员',
        price: 5.8,
        totalFee: 580,
        memberType: 2,
        memberDay: 180,
    },
    {
        title: '数听年度会员',
        price: 5.8,
        totalFee: 580,
        memberType: 4,
        memberDay: 180,
    },
    {
        title: '数听终身会员',
        price: 9.6,
        totalFee: 960,
        memberType: 3,
        memberDay: 36500,
    },
    {
        title: '数听挑战',
        price: 35,
        totalFee: 3500,
        memberType: 21,
        memberDay: 30
    }
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

// 生成订单
const genOrder = async function(openid, memberType, memberDay) {
    let good = GOODS.find(item => String(item.memberType) === String(memberType));
    if (!good) good = GOODS[3]; // 若没找到商品，默认终身会员（做兼容处理，一般不会出现
    // 如果是自定义会员，单独处理一下
    if (good.isCustom) {
        good.totalFee = memberDay * 10;
        good.title = `数听自定义${memberDay}天会员`;
        good.memberDay = memberDay;
    }

    const order = new Order({
        total_fee: good.totalFee,
        openid,
        body: good.title,
        attach: JSON.stringify(good)
    });

    const res = await db.collection('order').add({
        data: order
    })
    return order;
} 

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { memberType, memberDay } = event;
    console.log(event);
    if (!memberType) return {}

    const order = await genOrder(wxContext.OPENID, memberType, memberDay);

    return order.getOrder2payjsDto();
};

class Order {
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
        return dateFormatter(new Date(), "YYYYMMDDHHmmss") + String(Date.now()).slice(-3) + randomIntegerInRange(100, 999);
    }
    // 转成payjs需要的订单对象
    getOrder2payjsDto() {
        let payOrder = {
            mchid: this.mchid, // 商户号
            total_fee: this.total_fee,
            out_trade_no: this.out_trade_no,
            body: this.body,
            notify_url: cloud.DYNAMIC_CURRENT_ENV === PROD_ENV_NAME ? PayConfig.NOTIFY_URL : PayConfig.NOTIFY_URL_DEV,
            nonce: String(Date.now()), // 随机字符串
        };
        return {
            ...payOrder,
            sign: md5(`body=${payOrder.body}&mchid=${payOrder.MCHID}&notify_url=${payOrder.notify_url}&out_trade_no=${payOrder.out_trade_no}&total_fee=${payOrder.total_fee}&key=${PayConfig.KEY}`).toUpperCase(),
        }
    }
}