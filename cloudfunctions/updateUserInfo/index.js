// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const openid = event.openid || wxContext.OPENID;

    const { avatar, nickName } = event;

    let user = await db.collection('users').where({
        openid,
    }).limit(1).get().then(res => res.data[0]);

    if (!user) return {
        success: false,
        msg: '未找到用户'
    }

    if (avatar && user.avatar !== avatar) user.avatar = avatar;
    if (nickName && user.nickName !== nickName) user.nickName = nickName;

    let _id = user._id;
    delete user._id;
    let res = await db.collection('users').doc(_id).update({
        data: {
            ...user
        }
    })

    return {
        success: true,
        ...res
    }
}