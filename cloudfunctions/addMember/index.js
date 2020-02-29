// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { addDay = 0 } = event;
    let openid = event.openid || wxContext.OPENID;

    let curUser = await db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
    
    if (!curUser) return {
        success: false,
        msg: '用户不存在'
    }
    
    let res = await db.collection('users').doc(curUser._id).update({
        data: {
            isPro: true,
            proBeginDate: Date.now(),
            proEndDate: Date.now() + addDay * 24 * 60 * 60 * 1000
        }
    })

    return {
        success: true,
        ...res,
    }
}
