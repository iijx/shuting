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
    await cloud.openapi.customerServiceMessage.send({
        touser: wxContext.OPENID,
        msgtype: 'text',
        text: {
            content: '数听客服为您服务！  ios 版本若需开通会员，请到「数听英语」同名公众号下开通，小程序版暂不支持！'
        }
    })

    // await cloud.openapi.customerServiceMessage.send({
    //     touser: wxContext.OPENID,
    //     msgtype: 'image',
    //     image: {
    //         // mediaId: 'X5DeEF7Evn9H1JZoNkCm-1gGFDKpSAzbSCq0jbF19R43yUNTdFGn9uJOdoFP5vNk' // dev 
    //         mediaId: 'dhCP8q4nlYb4oEpxLyGhdauRtZslIMyDXWd23EFZH0oXB8pj76gMSEM_7VbX78b9' // prod
    //     }
    // })

    return 'success'
}