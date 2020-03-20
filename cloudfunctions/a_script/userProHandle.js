
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

module.exports = async (db) => {
    // 处理order
    let list = await db.collection('order').where({ status: 2}).get().then(res => res.data);
    for(item of list) {
        console.log(item);
        let proEndDate = new Date();
        if (String(item.attach.memberType) === '3') proEndDate = new Date(2120, 12, 30);
        if (String(item.attach.memberType) === '2') proEndDate = getDateByAddDay(item.created, 180);
        if (String(item.attach.memberType) === '1') proEndDate = getDateByAddDay(item.created, 30);
        await db.collection('users').where({ openid: item.openid}).update({
            data: {
                memberType: item.attach.memberType,
                proEndDate,
            }
        })
    }

    // 处理h5_order
    list = await db.collection('h5_order').where({ status: 2}).get().then(res => res.data);
    let curOpenid = ''
    for(item of list) {
        console.log(item);
        let proEndDate = new Date();
        if (String(item.attach.memberType) === '3') proEndDate = new Date(2120, 12, 30);
        if (String(item.attach.memberType) === '2') proEndDate = getDateByAddDay(item.createdAt, 180);
        if (String(item.attach.memberType) === '1') proEndDate = getDateByAddDay(item.createdAt, 30);
        
        console.log('---------------1: ', item.exchange_code);
        let codeInfo = await db.collection('exchange_code').where({ code: item.exchange_code, status: 3, type: 3}).get().then(res => res.data[0]);
        if (!codeInfo) continue;
        console.log('---------------1.1: ', codeInfo)
        curOpenid = codeInfo.exchangeOpenid;
        console.log('---------------2: ', curOpenid, proEndDate, curOpenid)

        await db.collection('users').where({ openid: curOpenid}).update({
            data: {
                memberType: String(item.attach.memberType),
                proEndDate,
            }
        })
    }
}