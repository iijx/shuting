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

    let openid = event.openid || wxContext.OPENID;

    let shareAppAward = await db.collection('exchange_code').where({
        userOpenid: openid,
        status: _.gte(2),
    }).orderBy('updatedAt', 'desc').get().then(res => res.data);

    console.log(shareAppAward)

    return {
        msgList: shareAppAward.map(item => ({
            ...(new ShareAppAwardMsg(item)),
            createdAt: item.updatedAt,
        }))
    }

}

class Message {
    constructor(opt) {
        this.title = opt.title;
        this.content = opt.content;
    }
}
class ShareAppAwardMsg extends Message{
    constructor(opt) {
        super({
            title: '限时分享活动奖励',
            content: '恭喜您获得在【限时分享活动】中获得一周会员奖励，会员兑换码为' + opt.code
        })
        this.msgType = 1;
        // this.title = '限时分享活动奖励';
        // this.content = '恭喜您获得在【限时分享活动】中获得一周会员奖励，会员兑换码为' + opt.code;
        this.exchangeCode = opt.code;
        this.exchangeCodeStatus = opt.status;
        this.exchangeCodeType = opt.type;
    }
}