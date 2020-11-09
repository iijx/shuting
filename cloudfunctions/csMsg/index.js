// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log(event);
    if (event.SessionFrom === 'member') {
        await cloud.openapi.customerServiceMessage.send({
            touser: wxContext.OPENID,
            msgtype: 'link',
            link: {
                title: '数听英语 · 开通会员',
                description: '查看会员计划',
                url: "https://payjs.cn/api/openid?mchid=1578310381&callback_url=".concat(encodeURIComponent("http://stcdn.iijx.site/?stid=" + wxContext.OPENID)),
                thumbUrl: 'https://cdnword.iijx.site/assets/imgs/shuting/icon-shuting.png'
            }
        })
        console.log('url: ')
        console.log("https://payjs.cn/api/openid?mchid=1578310381&callback_url=".concat(encodeURIComponent("http://stcdn.iijx.site/?stid=" + wxContext.OPENID)))
    } else {
        await cloud.openapi.customerServiceMessage.send({
            touser: wxContext.OPENID,
            msgtype: 'text',
            text: {
                content: '数听客服为您服务！'
            }
        })
    }
    return 'success'
}