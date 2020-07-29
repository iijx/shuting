
const cloud = require('wx-server-sdk');
const User = require('../models/user.js');
const ShareInfo = require('../models/shareInfo.js');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
});
const db = cloud.database();
const _ = db.command;

const getUser = async (openid) => db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
const createUser = async (openid) => {
    let user = new User({ openid });
    await db.collection('users').add({ data: user }).then(res => {
        return user._id = res._id;
    });
    return user;
}
const updateUser = async (id, user) => {
    if (user._id) delete user._id;
    return await db.collection('users').doc(id).update({
        data: {
            ...user
        }
    })
}
module.exports = async function(event, context) {
    console.log('user event', event);
    const { method, params = {} } = event;
    const wxContext = cloud.getWXContext()
    let openid = params.openid || wxContext.OPENID;
    let curUser = await getUser(openid);
    if (method === 'get') {
        if (!curUser) {
            curUser = await createUser(openid);
            if (params.fromOpenid && params.fromOpenid !== openid) {
                await db.collection('weapp_share').where({ openid: params.fromOpenid })
                    .update({ data: { invitedUser: _.addToSet(openid)}})
                    .then(async res => {
                        if(res.stats.updated <= 0) {
                            return await db.collection('weapp_share').add({ data: new ShareInfo(params.fromOpenid).addInvitedUser(openid) })
                        }
                        return res;
                    })
            }
        }
        return { 
            openid,
            ...curUser,
            isBuyOver24Hour: curUser.lastBuyTime || 0 > (Date.now() - 24 * 60 * 60 * 1000)
        }
    }
    else if (method === 'update') {
        if (!curUser) {
            return { success: false, msg: '未找到用户' }
        } else {
            const { avatar, nickName } = params;
            if (avatar && curUser.avatar !== avatar) curUser.avatar = avatar;
            if (nickName && curUser.nickName !== nickName) curUser.nickName = nickName;
            let res = await updateUser(curUser._id, curUser);
            return { success: true, ...res };
        }
    }
}