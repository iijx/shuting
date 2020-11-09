
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

const getAddDayByExchangeCodeType = (codeInfo = {}) => {
    // app 分享邀请活动 奖品兑换码
    if (codeInfo.type === 1) return 7;
    if (codeInfo.type === 3) {
        if (codeInfo.memberType === 1) return 30;
        if (codeInfo.memberType === 2) return 180;
        if (codeInfo.memberType === 4) return 360;
        if (codeInfo.memberType === 6) return 3 * 365;
        if (codeInfo.memberType === 3) return 100 * 365;
    }
    
    else return 0; 
}
module.exports = async (event, context) => {
    console.log('excCode event', event);
    const { method, params = {} } = event;
    const wxContext = cloud.getWXContext()
    const openid = params.openid || wxContext.OPENID;

    if (method === 'use') {
        const { code } = params;
        let codeInfo = await db.collection('exchange_code').where({ code }).limit(1).get().then(res => res.data[0]);
        // 1. 兑换码状态检查
        if (!codeInfo) return { success: false, msg: '兑换码不存在' }
        else if (codeInfo.status === 3) return { success: false, msg: '兑换码已被兑换' }
        else if (codeInfo.status !== 2) return { success: false, msg: '未知错误' }
        // 2. 兑换
        let curUser = await db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
        if (!curUser) return { success: false, msg: '用户不存在' }
        // 2.1 更新兑换码状态
        await db.collection('exchange_code').doc(codeInfo._id).update({
            data: {
                status: _.inc(1),
                exchangeOpenid: openid,
            }
        })
        // 2.2 更新用户状态
        await db.collection('users').doc(curUser._id).update({
            data: {
                isPro: true,
                proEndDate: Date.now() + getAddDayByExchangeCodeType(codeInfo) * 24 * 60 * 60 * 1000,
                memberType: codeInfo.memberType,
            }
        })
        return {
            success: true,
            msg: '兑换成功'
        }
    }
}