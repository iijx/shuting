// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV // API 调用都保持和云函数当前所在环境一致
})

const db = cloud.database();

class UserAward  {
    constructor(opt) {
        this.awardId = opt.awardId || '';
        this.openid = opt.openid || '';
        this.avatarUrl = opt.avatarUrl || '';
        this.nickName = opt.nickName || '';
        this.isRobot = opt.isRobot || false; // 是否是机器人
        this.chanceNum = opt.chanceNum || 0; // 抽奖剩余次数
        this.lotteriedNum = opt.lotteriedNum || 0; // 已经抽奖次数
        this.isWin = opt.isWin || false; // 是否已经中奖 
        this.luckyValue = opt.luckyValue || 0; // 运气值

        this.adLuckyStatus = opt.adLuckyStatus || 1; // 广告运气奖励 领取状态  1 未领取  2 已领取
        this.inviteLuckyStatus = opt.inviteLuckyStatus || 1; // 邀请运气奖励 领取状态  1 未领取  2 已领取
        this.invitee = opt.invitee || []; // 受邀人 openid
        this.inviter = opt.inviter || ''; // 邀请人
        this.created = opt.created || Date.now();
    }
}

const updateUser = async (id, user) => {
    if (user._id) delete user._id;
    return await db.collection('users').doc(id).update({
        data: {
            ...user
        }
    })
}
const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const _lottery = (luckyValue, winOneOfCount, winAddLucky100) => {
    // return true;
    const rate = (100/winOneOfCount + luckyValue * winAddLucky100/100);
    const num1 = parseInt(rate * 100);
    const num2 = randomIntegerInRange(0, 10000);
    // 人性调整
    // if (userAward.lotteriedNum)
    return num2 <= num1;
}



module.exports = async (event, context) => {
    console.log('award event', event);
    const { method, params = {} } = event;
    if (method === 'USER_AWARD_REL_LIST') {
        const { openid } = params;
        if (!openid) return {}
        const p1 = db.collection('award').where({ isPrivate: false }).get().then(res => res.data);
        const joinRecords = db.collection('user_award').where({ openid }).get().then(res => res.data);
        const res = await Promise.all([p1, joinRecords]);
        return {list: res[0], joinRecords: res[1]}
    }
    if (method === 'USER_AWARD_DETAIL') {
        const { params: { awardId, openid } } = event;
        const record = db.collection('award').doc(awardId).get().then(res => res.data);
        const userAward = db.collection('user_award').where({ awardId, openid }).get().then(res => res.data[0]);
        const joinUsers = db.collection('user_award').where({ awardId, lotteriedNum: db.command.gte(1) }).get().then(res => res.data);
        const res = await Promise.all([record, userAward, joinUsers])
        return {
            record: res[0],
            userAward: res[1],
            joinUsers: res[2]
        }
    }
    if (method === 'INIT_USER_AWARD') {
        const { params: { awardId, openid, luckyValue, inviter } } = event;
        // res: {id:cbddf0af60b85e210dec6649250f3267, requestId:179d02fb470_1}
        const res = await db.collection('user_award').add({
            data: new UserAward({
                awardId,
                openid,
                luckyValue,
                inviter,
                chanceNum: 1, // 默认自带 1 次抽奖机会
            }) 
        });
        if (res._id) {
            return { res, id: res._id, chanceNum: 1, luckyValue };
        } else return { msg: '服务器异常', res };
    }

    if (method === 'ADD_LUCKY_VALUE') {
        const { params: { id, luckyValue, from } } = event;
        const updateData = { luckyValue: db.command.inc(luckyValue) };
        if (from === 'INVITE_TASK') updateData.inviteLuckyStatus = 2;
        if (from === 'AD_TASK') updateData.adLuckyStatus = 2;
        return await db.collection('user_award').doc(id).update({ data: updateData })
    }

    if (method === 'UPDATE_AVATAR') {
        const { params: { id, avatarUrl, nickName }} = event;
        return await db.collection('user_award').doc(id).update({ data: { avatarUrl, nickName  } })
    }

    if (method === 'LOTTERY') {
        const { params: {awardId, openid, nickName, avatarUrl, inviter} } = event;
        const userAward = await db.collection('user_award').where({ awardId, openid }).limit(1).get().then(res => res.data[0]);
        console.log('userAward', userAward);
        const record = await db.collection('award').doc(awardId).get().then(res => res.data);
        console.log('record', record);
        if (userAward && record) {
            if (userAward.chanceNum <= 0) return { success: false, msg: '无抽奖次数' };
            const isWin = _lottery(userAward.luckyValue, record.winOneOfCount, record.winAddLucky100);
            const updateData = {
                isWin,
                chanceNum: db.command.inc(-1),
                lotteriedNum: db.command.inc(1),
                nickName, avatarUrl,
                inviter: userAward.inviter || inviter || ''
            }
            if (updateData.inviter) {
                await db.collection('user_award').where({ awardId, openid: updateData.inviter }).update({
                    data: { invitee: db.command.addToSet(openid) },
                });
            }
            await db.collection('user_award').doc(userAward._id).update({ data: updateData });
            
            // 奖品记录 更新
            const awardUpdateData = {};
            if (userAward.lotteriedNum <= 0) awardUpdateData.joinCount = db.command.inc(1);
            if (isWin) awardUpdateData.remainCount = db.command.inc(-1);
            if (Object.keys(awardUpdateData).length > 0) {
                await db.collection('award').doc(awardId).update({ data: awardUpdateData });
            }

            return { isWin, msg: isWin ? '中奖咯' : '没中' };
        }
    }

    if (method === 'ADD_ROBOT_LOTTERY') {
        const { params: { awardId, lotteryCount } } = event;
        let users = await db.collection('users').where({ isRobot: true }).get().then(res => res.data);
        users = users.sort((a, b) => Math.random() - 0.5).slice(0, 30); // 随机取前30个

        const record = await db.collection('award').doc(awardId).get().then(res => res.data);
        if (!record) return { msg: 'award 不存在'}; // record 不太可能不存在
        console.log('record', record);
        // 开始模拟抽奖
        for (const user of users) {
            let userAward = await db.collection('user_award').where({ awardId, openid: user.openid }).limit(1).get().then(res => res.data[0]);
            console.log('userAward 准备抽奖', userAward);
            // 1. 如果一次都没抽过，添加初始化记录
            if (!userAward) {
                const luckyValue = randomIntegerInRange(8, 20);
                const res = await db.collection('user_award').add({
                    data: new UserAward({
                        awardId,
                        openid: user.openid,
                        luckyValue,
                        chanceNum: 1, // 默认自带 1 次抽奖机会
                        isRobot: true
                    }) 
                });
                userAward = { _id: res._id, lotteriedNum: 0, luckyValue, isWin: false }
            }
            // 2. 对没中奖的抽奖
            if (!userAward.isWin) {
                let tempCount = 0;
                const myLotteryCount = randomIntegerInRange(0, lotteryCount * 2);
                const autoLottery = async () => {
                    tempCount++;
                    const isWin = _lottery(userAward.luckyValue, record.winOneOfCount, record.winAddLucky100);
                    console.log('isWin', isWin);
                    if (!isWin) {
                        const luckyValue = randomIntegerInRange(20, 100);
                        userAward.luckyValue += luckyValue;
                        userAward.lotteriedNum += 1;
                        if (tempCount < myLotteryCount) autoLottery();
                        else await db.collection('user_award').doc(userAward._id).update({
                            data: {
                                lotteriedNum: tempCount, isWin: false, luckyValue: userAward.luckyValue, nickName: user.nickName, avatarUrl: user.avatar
                            }
                        });
                    }
                    else await db.collection('user_award').doc(userAward._id).update({
                        data: {
                            lotteriedNum: tempCount, isWin: true, luckyValue: userAward.luckyValue, nickName: user.nickName, avatarUrl: user.avatar
                        }
                    });
                }
                autoLottery();
            }
        }
        return {msg: '抽奖完成'}
    }

    if (method === 'FIND_LOTTERY_USER') {
        const { params: { awardId } } = event;
        const users = await db.collection('user_award').where({ awardId, lotteriedNum: db.command.gte(1) }).get().then(res => res.data);
        return users;
    }
 };
