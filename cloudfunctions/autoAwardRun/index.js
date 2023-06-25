// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const DB = cloud.database();
const _ = DB.command;

// 云函数入口函数
exports.main = async (event, context) => {
    DB.collection('user_award').where({
        isWin: false,
    }).update({
        data: {
            chanceNum: 1,
            inviteLuckyStatus: 1,
            adLuckyStatus: 1,
            inviter: '',
            invitee: [],
        }
    })
}