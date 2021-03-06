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

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { code } = event;
    const openid = event.openid || wxContext.OPENID;
    
    console.log(openid);

    let codeInfo = await db.collection('exchange_code').where({
        code,
    }).limit(1).get().then(res => res.data[0]);

    // 兑换码状态检查
    if (!codeInfo) return {
        success: false,
        msg: '兑换码不存在'
    }
    if (codeInfo.status === 3) return {
        success: false,
        msg: '兑换码已被兑换'
    }
    if (codeInfo.status !== 2) return {
        success: false,
        msg: '未知错误'
    }


    await db.collection('exchange_code').doc(codeInfo._id).update({
        data: {
            status: _.inc(1),
            exchangeOpenid: openid,
        }
    })

    let curUser = await db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
    
    if (!curUser) return {
        success: false,
        msg: '用户不存在'
    }
    
    let res = await db.collection('users').doc(curUser._id).update({
        data: {
            isPro: true,
            isPaid: true,
            proEndDate: Date.now() + getAddDayByExchangeCodeType(codeInfo) * 24 * 60 * 60 * 1000,
            lastBuyTime: Date.now(),
            memberType: codeInfo.memberType,
        }
    })

    // 如果有班长奖励
    // let inviteRecord = await db.collection('invite').where({ _openid: openid }).limit(1).get().then(res => res.data[0]);
    // if (inviteRecord) {
    //     let awardInfo = INVITE_AWARD.find(item => String(item.memberType) === String(codeInfo.memberType)) || {};
        
    //     await db.collection('invite').doc(inviteRecord._id).update({data: {
    //         buyedMemberType: Number(codeInfo.memberType),
    //         buyedMemberTitle: awardInfo.memberTitle,
    //         cashAward: awardInfo.cash,
    //         avatar: curUser.avatar,
    //         nickName: curUser.nickName,
    //         updateAt: Date.now()
    //     }})

    //     await db.collection('users').where( { openid: inviteRecord.inviter}).update({
    //         data: {
    //             totalMoney: _.inc(awardInfo.cash)
    //         }
    //     });
    // }

    return {
        success: true,
        msg: '兑换成功'
    }
}