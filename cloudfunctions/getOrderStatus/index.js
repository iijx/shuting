// 云函数入口文件
const cloud = require('wx-server-sdk')


// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

    const { out_trade_no } = event;
    console.log(event);
    const wxContext = cloud.getWXContext()

    const order = await db.collection('order').where({
        out_trade_no: out_trade_no,
    }).limit(1).get().then(res => res.data[0]);

    console.log(order);
    if (!order) {
        return {
            status: -1,
            msg: '订单不存在'
        }
    } 

    if (String(order.status) === '2') {
        return {
            status: 2,
            msg: '支付成功'
        }
    } 
    
    if (String(order.status) === '1') {
        return {
            status: order.status,
            msg: '暂未查询到成功支付'
        }
    }

    return {
        status: order.status,
        msg: '未知订单状态'
    }
}