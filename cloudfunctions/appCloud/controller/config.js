
// 云函数入口文件
const cloud = require('wx-server-sdk')
const appConfig = require('../appConfig');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
})

// 云函数入口函数
module.exports = async (event, context) => {
    appConfig.init();
    
    return {
        success: true,
        ...appConfig,
    }
}