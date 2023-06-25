
const cloud = require('wx-server-sdk');
const User = require('../models/user.js');
const ShareInfo = require('../models/shareInfo.js');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
});
const db = cloud.database();
const _ = db.command;

const getUser = async (openid) => db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
const createUser = async (openid, appuuid) => {
    let user = new User({ openid, appuuid });
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

const randomString = (() => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return length => {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
})();
module.exports = async function(event, context) {
    console.log('user event', event);
    const { method, params = {} } = event;
    const wxContext = cloud.getWXContext()
    let openid = params.openid || wxContext.OPENID;
    let curUser = await getUser(openid);
    if (method === 'get') {
        if (!curUser) {
            curUser = await createUser(openid, params.appuuid);
            let fromOpenid = params.fromOpenid;
            const timeline = params.timeline || {};
            // 有可能是从朋友圈来的
            if (!fromOpenid && timeline.batteryLevel) {
                const bindRes = await db.collection('bind').where({
                    moniDeviceId: timeline.moniDeviceId,
                    batteryLevel: timeline.batteryLevel,
                    timestamp: _.gt(timeline.timestamp - 1000 * 10)
                }).limit(1).get().then(res => res.data[0]);
                console.log('bindRes', bindRes);
                if (bindRes) fromOpenid = bindRes.fromOpenid || '';
            }
            if (fromOpenid && fromOpenid !== openid) {
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
        console.log(!!curUser, !!params.appuuid, curUser.appuuid !== params.appuuid)
        // 绑定下users表
        if (curUser && params.appuuid && curUser.appuuid !== params.appuuid) {
            await db.collection('users').doc(curUser._id).update({data: { appuuid: params.appuuid }})
        }
        // 绑定下appuser表
        if(params.appuuid) {
            await db.collection('appuser').where({ appuuid: params.appuuid }).update({
                data: { openid: curUser.openid, nickName: curUser.nickName, avatar: curUser.avatar }
            })
        }

        return { 
            openid,
            ...curUser,
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
    else if (method === 'openMember') {
        const { memberType, isPaid, memberDay, openid } = params;
        let user = await getUser(openid);
        let proEndDate = Date.now() + memberDay * 24 * 60 * 60 * 1000;
        await db.collection('users').doc(user._id).update({
            data: {
                isPro: true,
                memberType: Number(memberType),
                proEndDate,
                lastBuyTime: Date.now(),
                isPaid,
                updateAt: new Date(),
            }
        })
        return { success: true, data: user }
    } else if (method === 'setLongMember') {
        const { needSetOpenid } = params;
        let user = await getUser(needSetOpenid);
        const longTime = 365 * 100;
        let proEndDate = Date.now() + longTime * 24 * 60 * 60 * 1000;
        const res = await db.collection('users').doc(user._id).update({
            data: {
                isPro: true,
                proEndDate,
            }
        })
        return { success: true, ...res}
    } else if (method === 'addRobot') {
        const nickNames = ["蒋蔚然", "贾致萱", "杜萧玉", "阎柔淑", "程运馨", "尹含双", "汪娅静", "韩谷蓝", "余觅露", "夏叶农", "漕昭昭", "邓香萱", "康怀萍", "黎玉兰", "谢紫玉", "石彤雯", "汤乐蓉", "蔡听莲", "朱语兰", "谭施诗", "方春琳", "贺季雅", "钱婧瑶", "程庄雅", "廖燕平", "龚逸丽", "何芳芳", "史雯丽", "邓逸雅", "杨施诗", "赵余馥", "范彤彤", "白琬玲", "金妙春", "孙妮子", "林乐瑶", "宋泽恩", "朱睿敏", "范清雅", "沈晓霞", "邱山雁", "叶元绿", "夏琇莹", "郭芸芸", "李丁辰", "汤秀君", "黄湛霞", "黄安然", "郭寻巧", "姚傲之", "廖闵雨", "于曦秀", "谢言文", "孔妙妙", "贺玲丽", "康婵娟", "胡翠绿", "傅天籁", "汪涵山", "田傲丝", "程琼英", "唐芳馨", "汤白筠", "乔斯文", "史彤蕊", "马大梅", "杜和平", "李映之", "钱水悦", "杜恨寒", "苏立婷", "高丽英", "钱孟夏", "文清润", "许文姝", "杨凌晴", "范彩娟", "刘傲玉", "卢寒云", "戴令慧", "常雁芙", "郑依童", "段初曼", "阎方雅", "何兰七", "曹冬雪", "萧睿彤", "李珺俐", "钱诗云", "乔白安", "姚寒梦", "邹绮梅", "夏玄清", "李玉珂", "冯兰泽", "叶娟丽", "萧贤惠", "郭颖然", "赖晓洁", "唐端雅"];
        for (const i of [...new Array(60).keys()]) {
            const user = new User({
                openid: randomString(10),
                avatar: `https://unicdn.tiaoxuanyoushu.com/imgs/avatar/${i}.jpg`,
                nickName: nickNames[i],
                isRobot: true,
            });
            await db.collection('users').add({data: user});
        }
    }

    else if (method === 'weixinSendMember') {
        const { memberDay, memberType } = params;
        curUser.isPro = true;
        curUser.memberType = Number(memberType);
        curUser.proEndDate = Date.now() + memberDay * 24 * 60 * 60 * 1000;
        curUser.lastBuyTime = -1;
        curUser.updateAt = new Date();
        await updateUser(curUser._id, curUser);
        return { success: true, data: curUser }
    }
}