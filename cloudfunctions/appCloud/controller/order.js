// 云函数入口文件
const cloud = require('wx-server-sdk')
const GOODS = require('../appConfig').GOODS;
const Order = require('../models/order');

// 初始化 cloud
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
})

const db = cloud.database();

// 生成订单
const genOrder = async function(openid, memberType, memberDay) {
    let good = GOODS.find(item => String(item.memberType) === String(memberType));
    if (!good) good = GOODS[3]; // 若没找到商品，默认终身会员（做兼容处理，一般不会出现
    // 如果是自定义会员，单独处理一下
    if (good.isCustom) {
        good.totalFee = Math.round(memberDay * 20);
        good.title = `数听自定义${memberDay}天会员`;
        good.memberDay = memberDay;
    }

    const order = new Order({
        total_fee: good.totalFee,
        openid,
        body: good.title,
        attach: JSON.stringify({
            memberType: good.memberType,
            memberDay: good.memberDay
        })
    });

    const res = await db.collection('order').add({
        data: order
    })
    return order;
} 

module.exports = async (event, context) => {
    console.log('order event', event);
    const { method, params = {} } = event;
    const wxContext = cloud.getWXContext()
    //  创建订单
    if (method === 'post') {
        const { memberType, memberDay } = params;
        if (!memberType) return {}
        const order = await genOrder(wxContext.OPENID, memberType, memberDay);

        return order.getOrder2payjsDto(cloud.DYNAMIC_CURRENT_ENV);
    }
    //  获取订单状态
    else if (method === 'getStatus') {
        const { out_trade_no } = params;
        const order = await db.collection('order').where({ out_trade_no }).limit(1).get().then(res => res.data[0]);
        console.log(order);

        if (!order) return { status: -1, msg: '订单不存在' };
        else if (String(order.status) === '2') return { status: 2, msg: '支付成功' }
        else if (String(order.status) === '1') return { status: 1, msg: '暂未查询到成功支付' }
        else return { status: order.status, msg: '未知订单状态' }
    }
};
