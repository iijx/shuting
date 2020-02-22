// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let { fromOpenid, openid }  = event;

    if (!openid) openid = wxContext.OPENID;
    // 数据检查
    if (!openid || !fromOpenid || fromOpenid === openid) return {}

    
    let t_weapp_share = db.collection('weapp_share');
    

    // 被邀请人
    let inviteeUser = new InviteeUser({
        openid: openid
    });

    // 更新数据
    await t_weapp_share.where({
        openid: fromOpenid
    }).update({
        data: {
            inviteeUsers: _.addToSet(inviteeUser)
        }
    }).then(async res => {
        // 如果没有更新到，则创建
        if(res.stats.updated <= 0) {
            return await t_weapp_share.add({
                data: new ShareInfo({
                    openid: fromOpenid,
                    inviteeUsers: [inviteeUser]
                })
            })
        } else return res;
    })

    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}





class InviteeUser {
    constructor(opt) {
        this.openid = opt.openid;
        this.avatar = opt.avatar || '';
        this.nickName = opt.nickName || '';

        this.createAt = new Date();
    }
}
class ShareInfo {
    constructor(opt) {
        this.openid = opt.openid;
        this.inviteeUsers = [...opt.inviteeUsers];
    }
}