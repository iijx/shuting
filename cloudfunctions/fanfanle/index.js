// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database();
const _ = db.command

const START_TIME = new Date(2020, 2, 16); //202年3月16日 第一期开始
const WEEK_DAY = 7;

const PERIOD_CARD_NUM = 3;

const AwardBag = [0.5, 1, 0.5].map(item => ({ awardType: 'member', memberDay: item}));

/**
 * 判断两个date之间的天数差
 * @param {*} dateInitial 
 * @param {*} dateFinal 
 */
const getDaysDiffBetweenDates = (dateInitial, dateFinal) => (dateFinal - dateInitial) / (1000 * 3600 * 24);


/**
 * 根据某一天，得到相对某一天的日期
 * @param {*} day 
 * @param {*} addDayNum 
 */
const getDateByAddDay = (day, addDayNum) => {
    let t = new Date(day)
    t.setDate(t.getDate() + addDayNum)
    return t
}

// 开卡片奖品
const openCard = async (openid, award = {}) => {
    let { periodNum } = getBasePeriodInfo();
    let oldRecord = await db.collection('fanfanle').where({ openid, periodNum}).limit(1).get().then(res => res.data[0]);
    console.log('opencard oldRecord', oldRecord);
    if (oldRecord) {
        await db.collection('fanfanle').doc(oldRecord._id).update({
            data: {
                awardList: _.push(award)
            }
        })
        if (oldRecord.awardList.length + 1 >= PERIOD_CARD_NUM) {
            await exchangeAward(oldRecord._id);
        }
    } else {
        let record = new FflRecord({
            award,
            openid,
            periodNum,
        });
        return await db.collection('fanfanle').add({
            data: record
        })
    }
}

// 兑换奖品
const exchangeAward = async (period_id) => {
    let record = await db.collection('fanfanle').doc(period_id).get().then(res => res.data);
    if (!record) return;

    if ( !record.isExchanged && record.awardList.length >= PERIOD_CARD_NUM) {
        let memberDay = record.awardList.reduce((ac, cur) => ac + (cur.awardType === 'member' ? cur.memberDay : 0), 0);
        console.log('memberDay 0', memberDay)
        
        await addMemberDay(record.openid, memberDay);

        await db.collection('fanfanle').doc(period_id).update({
            data: { isExchanged: true }
        });
    }
}

const getBasePeriodInfo = () => {
    let dayDiff = getDaysDiffBetweenDates(START_TIME, getToday());
    let periodNum =  Math.floor(dayDiff / WEEK_DAY) + 1;
    let curDayIndex =  (dayDiff + 1) % WEEK_DAY; // 从1开始
    let periodStart = getDateByAddDay(getToday(), -(curDayIndex - 1));
    let periodEnd = getDateByAddDay(getToday(), WEEK_DAY - curDayIndex);

    return {
        dayDiff,
        curDayIndex,
        periodNum,
        periodStart,
        periodEnd,
    }
}

const getPeriodInfo = async (openid) => {
    let periodInfo = getBasePeriodInfo();
    
    let userPeriod = await db.collection('fanfanle').where({ openid,  periodNum: periodInfo.periodNum}).limit(1).get().then(res => res.data[0]);
    let awardList = [];
    let sharedUserOpenid = [];
    if (userPeriod) {
        awardList = userPeriod.awardList.map(item => ({ ...item, isOpened: true}));
        sharedUserOpenid = userPeriod.sharedUserOpenid;
    }
    
    awardList = awardList.concat(AwardBag.slice(awardList.length));

    return {
        ...periodInfo,
        sharedUserOpenid,
        awardList
    }
} 

// 添加会员天数
const addMemberDay = async (openid, memberDay) => {
    console.log('memberDay', memberDay);
    let curUser = await db.collection('users').where({ openid }).limit(1).get().then(res => res.data[0]);
    
    curUser.proEndDate = curUser.proEndDate || new Date(); // 兼容一下，以防止旧数据没有这个字段
    let proEndDate = new Date(Math.max(Date.now(), new Date(curUser.proEndDate).getTime()) + memberDay * 24 * 60 * 60 * 1000);
    console.log('proEndDate', proEndDate);
    let res = await db.collection('users').doc(curUser._id).update({
        data: {
            isPro: true,
            proEndDate
        }
    })
    return {
        success: true,
        ...res,
    }
}

const getToday = () => {
    let _day = new Date();
    _day.setHours(0, 0, 0, 0);
    return _day;
};


const addShare = async(openid, sharedUserOpenid) => {
    if (!sharedUserOpenid || sharedUserOpenid === openid) return;
    
    let { periodNum } = getBasePeriodInfo();
    let record = await db.collection('fanfanle').where({ openid: sharedUserOpenid, periodNum}).limit(1).get().then(res => res.data[0]);
    if (record) {
        db.collection('fanfanle').doc(record._id).update({
            data: {
                sharedUserOpenid: _.addToSet(openid)
            }
        })
    } else {
        let record = new FflRecord({
            award: [],
            openid,
            periodNum,
            sharedUserOpenid: [openid]
        });
        return await db.collection('fanfanle').add({
            data: record
        })
    }
}
exports.main = async (event, context) => {
    const { operate } = event;
    let openid = event.openid || cloud.getWXContext().OPENID;
    console.log(event);
    if (operate === 'openCard') {
        let { memberDay, awardType } = event;
        await openCard(openid, {
            memberDay,
            awardType
        })
        return;
    }

    if (operate === 'getPeriodInfo') {
        return await getPeriodInfo(openid);
    }

    if (operate === 'addShare') {
        let { sharedUserOpenid } = event;
        
        return await addShare(openid, sharedUserOpenid);
    }
}


class FflRecord {
    constructor(opt) {
        this.awardList = [{...opt.award}],
        this.openid = opt.openid;
        this.periodNum = opt.periodNum;
        this.isExchanged = false;
        this.createAt = new Date();
        this.sharedUserOpenid = opt.sharedUserOpenid || [];
    }
}