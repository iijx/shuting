
const cloud = require('wx-server-sdk')
const userController = require('./user.js')
const orderController = require('./order.js')
const Duju = require('../models/duju.js');
// 初始化 cloud
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
})

const db = cloud.database();

module.exports = async (event, context) => {
    console.log('event event', event);
    const { method = '', params = {} } = event;

    if (method === 'ORDER_PAY_SUCCESS') {
        // const { openid } = params || {};
        // 1. update order status
        const orderRes = await orderController({
            method: 'updateStatus',
            params: { ...params }
        }, context);

        if (!orderRes.success) return orderRes;

        const openid = orderRes.order.openid;

        let attach = JSON.parse(orderRes.order.attach) || {};
        if (!attach.memberDay) {
            console.log('错误该订单没有attach或attach.memberDay', orderRes);
            return;
        }

        // 2. update user memberDay
        const userRes = await userController({
            method: 'openMember',
            params: {
                openid,
                isPaid: true,
                ...attach
            }
        }, context)

        // 3. update duju if need
        if (String(attach.memberType) === '20') {
            const duju = new Duju({ 
                openid: openid,
                payjs_order_id: params.payjs_order_id,
                out_trade_no: params.out_trade_no
            });
            const res = await db.collection('duju').add({ data: duju });
            return res;
        }
        else return userRes;
    }
}