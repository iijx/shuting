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
    const { 
        out_trade_no,
        status,
        time_end,
        payjs_order_id,
        transaction_id,
        openid
    } = event.POSTBODY || {};
    const wxContext = cloud.getWXContext()
    const order  = await db.collection('order').where({
        out_trade_no,
    }).limit(1).get().then(res => res.data[0]);

    if (!order) return {
        success: false,
        msg: '订单不存在'
    }

    if (order.status === status ) {
        return {
            success: true,
            msg: '无需修改'
        }
    }

    await db.collection('order').doc(order._id).update({
        data: {
            status: status,
            time_end,
            payjs_order_id,
            transaction_id,
            updateAt: new Date(),
        }
    });

    let user = await db.collection('users').where({ openid: order.openid }).limit(1).get().then(res => res.data[0]);

    let attach = JSON.parse(order.attach || '{}');
    if (!attach.memberDay) {
        console.log('错误该订单没有attach', event, order, user);
        // todo 兼容旧版本
        await db.collection('users').doc(user._id).update({
            data: {
                isPro: true,
            }
        });
        return;
    } else {
        let proEndDate = Date.now() + attach.memberDay * 24 * 60 * 60 * 1000;
        await db.collection('users').doc(user._id).update({
            data: {
                isPro: true,
                memberType: attach.memberType || -1,
                proEndDate,
                updateAt: new Date(),
            }
        })
    }
}