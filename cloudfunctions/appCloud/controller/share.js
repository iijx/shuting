const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
})
const db = cloud.database();
const Utils = require('../lib/utils');

const getUser = async (openid) => db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);

module.exports = async function(event, context) {
    console.log('share event', event);
    const { method, params = {} } = event;
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID;
    let curUser = await getUser(openid);

    if (method === 'useFreeMember') {
        await db.collection('weapp_share').where({ openid })
            .update({ data: { isUsedFreeMember: true }})
            .then(res => {
                console.log(res);
            })
        
        let proEndDate = Math.max(Date.now(), curUser.proEndDate) + 7 * 24 * 60 * 60 * 1000;
        await db.collection('users').doc(curUser._id).update({
            data: {
                isPro: true,
                isPaid: curUser.isPaid || false,
                proEndDate,
                updateAt: new Date(),
            }
        });
        return { success: true, message: '兑换成功' }
    } else if (method === 'useMemberDouble') {
        await db.collection('weapp_share').where({ openid })
            .update({ data: { isUsedMemberDouble: true }})
            .then(res => {
                console.log(res);
            })
        
        let proEndDate = Math.max(Date.now(), curUser.proEndDate) + Utils.getMemberDayByType(curUser.memberType) * 24 * 60 * 60 * 1000;
        await db.collection('users').doc(curUser._id).update({
            data: {
                proEndDate,
                updateAt: new Date(),
            }
        });
        return { success: true, message: '兑换成功' }
    }
    return {}
}



