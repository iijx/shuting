// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    let openid = event.openid || wxContext.OPENID;
    const { operate, content } = event;
    console.log(event);
    console.log(operate);
    if (operate === 'add') {
        let user = await db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
        await db.collection('advice').add({
            data: new Advice({
                content,
                avatar: user.avatar,
                nickName: user.nickName,
                openid: user.openid,
            })
        });
    }

    else if (operate === 'getAll') {
        let list = await db.collection('advice').get();
        return list
    }

    else if (operate === 'like') {
        let { adviceId } = event;
        await db.collection('advice').doc(adviceId).update({
            data: {
                likeUserOpenid: _.addToSet(openid),
                likeNum: _.inc(1)
            }
        })

    } 
    else if (operate === 'unlike') {
        let { adviceId } = event;
        await db.collection('advice').doc(adviceId).update({
            data: {
                likeUserOpenid: _.pull(openid),
                likeNum: _.inc(-1)
            }
        })
    }

    return {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}

class Advice {
    constructor(opt) {
        this.content = opt.content;
        this.avatar = opt.avatar;
        this.nickName = opt.nickName;
        this.openid = opt.openid;
        this.likeNum = 0;
        this.likeUserOpenid = []

        this.createdAt = new Date();
        this.updateAt = new Date();
    }
}