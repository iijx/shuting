// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})
const sendMember = async (openid) => {
    await cloud.openapi.customerServiceMessage.send({
        touser: openid,
        msgtype: 'link',
        link: {
            title: '数听英语 · 开通会员',
            description: '查看会员计划',
            url: "https://payjs.cn/api/openid?mchid=1578310381&callback_url=".concat(encodeURIComponent("http://stcdn.iijx.site/?stid=" + openid)),
            thumbUrl: 'https://cdnword.iijx.site/assets/imgs/shuting/icon-shuting.png'
        }
    })
}

const sendMember2 = async (openid) => {
    await cloud.openapi.customerServiceMessage.send({
        touser: openid,
        msgtype: 'link',
        link: {
            title: '数听英语 · 开通会员',
            description: '查看会员计划',
            url: "https://payjs.cn/api/openid?mchid=1578310381&callback_url=".concat(encodeURIComponent("https://pay.amathclass.cn/#/pages/shutingbuy/shutingbuy?appOpenid=" + openid)),
            thumbUrl: 'https://cdnword.iijx.site/assets/imgs/shuting/icon-shuting.png'
        }
    })
}

exports.main = async (event, context) => {
    console.log(event);
    // event 【user_enter_tempsession】
    if (event.MsgType === 'event' && event.Event === 'user_enter_tempsession') {
        if (event.SessionFrom === 'member') {
            await sendMember2(event.FromUserName);
        }
    }
    // text
    if (event.MsgType === 'text') {
        if (event.Content.trim() === '6') {
            await sendMember2(event.FromUserName);
        }
        // if (event.Content.trim() === '7') {
        //     await sendMember2(event.FromUserName);
        // }
        return {
            MsgType: 'transfer_customer_service',
            ToUserName: event.FromUserName,
            FromUserName: event.ToUserName,
            CreateTime: parseInt(+new Date / 1000),
        }
    }
}