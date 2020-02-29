// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

const CAN_AWARD_MIN_INVITE = 3; // 可以奖励的最小邀请数
const AWARD_MENBER_DAY = 7; // 每次奖励的赠送天数

// const cloud_getMessage = async (openid) =>  cloud.callFunction({
//     name: 'getMessage',
//     data: {
//         openid,
//     }
// });
// 云函数入口函数
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID;

    console.log('openid', openid);

    // 获取该用户的分享邀请数据
    let shareInfo = await db.collection('weapp_share').where({
        openid,
    }).limit(1).get().then(res => {
        if (res.data && res.data.length > 0) return res.data[0];
        else return null;
    });

    // 没有分享信息，就直接返回
    if (!shareInfo) return {
        isUpdatedNewAward: false,
        inviteeCount: 0,
        awardednum: 0,
        usedInviteCount: 0,
        msg: '未找到分享'
    };

    let remainCount = shareInfo.inviteeUsers.length - shareInfo.usedInviteCount;
    
    // 还不够奖励，直接返回
    if (remainCount < CAN_AWARD_MIN_INVITE) return {
        isUpdatedNewAward: false,
        awardedNum: shareInfo.awardedNum,
        inviteeCount: shareInfo.inviteeUsers.length,
        usedInviteCount: shareInfo.usedInviteCount,
        msg: '分享不足以奖励'
    };

    
    // 奖品数量
    let awardNum = Math.floor(remainCount / CAN_AWARD_MIN_INVITE);

    let t_exchange_code = db.collection('exchange_code');

    console.log(shareInfo)

    try {
        const result = await db.runTransaction(async transaction => {
            // 发放兑换码
            // 1. 搜索可用的出来
            console.log(1);
            let codeArr = await t_exchange_code.where({
                type: 1,
                status: 1,
            }).limit(awardNum).get().then(res => res.data)
            console.log(2, codeArr);
            // 2. 更改这条的状态
            await t_exchange_code.where({
                _id: _.in(codeArr.map(item => item._id))
            }).update({
                data: {
                    userOpenid: openid,
                    status: _.inc(1),
                    updatedAt: new Date()
                }
            })
            console.log(3);
            // 添加发放用户邀请奖励激励
            await db.collection('weapp_share').doc(shareInfo._id).update({
                data: {
                    usedInviteCount: _.inc(awardNum * CAN_AWARD_MIN_INVITE),
                    awardedNum: awardNum,
                }
            })
            console.log(4);

            return codeArr;
        })
        return {
            isUpdatedNewAward: true,
            inviteeCount: shareInfo.inviteeUsers.length,
            usedInviteCount: shareInfo.usedInviteCount + awardNum * CAN_AWARD_MIN_INVITE,
            awardedNum: awardNum,
            msg: '奖励已更新'
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    
}