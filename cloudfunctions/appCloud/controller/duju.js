
const cloud = require('wx-server-sdk');
const Duju = require('../models/duju.js');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
});
const db = cloud.database();
const _ = db.command;

const updateDujuRefundStatus = async (payjs_order_id) => {
    return await db.collection('duju').where({ payjs_order_id }).update({
        data: {
            refundStatus: 'success'
        }
    })
}
module.exports = async function(event, context) {
    console.log('user event', event);
    const { method, params = {} } = event;
    const wxContext = cloud.getWXContext()
    let openid = params.openid || wxContext.OPENID;

    if (method === 'get') {
        const duju = await db.collection('duju').where({ openid }).limit(1).get().then(res => res.data[0]);
        return {
            success: true,
            duju: { ...duju }
        };
    }

    if (method === 'dujuRefundSucess') {
        const { payjs_order_id } = params;
        return await updateDujuRefundStatus(payjs_order_id, 'success');
    }
}