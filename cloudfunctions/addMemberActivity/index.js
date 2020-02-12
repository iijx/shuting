// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { addDay = 0 } = event;

    let curUser = await db.collection('users').where({ openid: wxContext.OPENID }).limit(1).get().then(res => {
        if (res.data && res.data.length > 0) return res.data[0];
        else return null;
    });

    
    console.log(curUser);
    if(curUser.isGetedActivityMember) return curUser;
    else {
        return await db.collection('users').doc(curUser._id).update({
            data: {
                isPro: true,
                isGetedActivityMember: true,
                proBeginDate: Date.now(),
                proEndDate: Date.now() + addDay * 24 * 60 * 60 * 1000
            }
        })

    }
}
