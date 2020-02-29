// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    
    // return;


    let res = await cloud.downloadFile({
        fileID: 'cloud://prod-mxd6w.7072-prod-mxd6w-1301174177/kefu_wx.JPG',
    })
    const file = fs.readFileSync(path.join(__dirname, 'kefu_wx.JPG'))
    res = cloud.openapi.customerServiceMessage.uploadTempMedia({
        type: 'image',
        media: {
          contentType: 'image/png',
          value: res.fileContent
        }
    })
    console.log(res);
    return res;
}