// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const DB = cloud.database();
const _ = DB.command;

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('执行memberHandlerByDay', new Date());
    
    await DB.collection('users').where({
        isPro: true,
        proEndDate: _.lt(Date.now())
    }).update({
        data: {
            isPro: false
        }
    })
}