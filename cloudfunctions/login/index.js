// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')


// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
    const fromOpenid = event.fromOpenid;
    console.log(event.fromOpenid);

    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
    const wxContext = cloud.getWXContext()

    let curUser = await db.collection('users').where({ openid: wxContext.OPENID }).limit(1).get().then(res => res.data[0]);

    if(!curUser) {
        curUser = new User({
            openid: wxContext.OPENID,
        });
        await db.collection('users').add({ data: curUser }).then(res => {
            return curUser._id = res._id;
        });

        console.log('fromOpenid', fromOpenid);
        
        if (fromOpenid && fromOpenid !== wxContext.OPENID) {
            const res = await cloud.callFunction({
                name: 'weappShare',
                data: {
                    openid: wxContext.OPENID,
                    fromOpenid,
                }
            });
            console.log(res);
        }
    }

    return {
        openid: wxContext.OPENID,
        ...curUser
    }
}

class User {
    constructor(opt) {
        this.openid = opt.openid || '';
        this.avatar = opt.avatar || '';
        this.nickName = opt.nickName || '';
        this.isPro = false;
        this.proEndDate = 0;
        
        this.createAt = Date.now();
        this.updateAt = Date.now();
    }
}