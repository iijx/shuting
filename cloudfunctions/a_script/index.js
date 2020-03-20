// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

const TimeHandler = require('./timeHandle');


// 云函数入口函数
exports.main = async (event, context) => {
   
    await TimeHandler(db);

    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }
}