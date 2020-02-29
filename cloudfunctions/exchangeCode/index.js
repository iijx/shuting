// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

const getAddDayByExchangeCodeType = type => {
    // app 分享邀请活动 奖品兑换码
    if (type === 1) return 7;
    
    else return 0; 
}

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { code } = event;
    const openid = event.openid || wxContext.OPENID;
    
    console.log(openid);

    let codeInfo = await db.collection('exchange_code').where({
        code,
    }).limit(1).get().then(res => res.data[0]);

    // 兑换码状态检查
    if (!codeInfo) return {
        success: false,
        msg: '兑换码不存在'
    }
    if (codeInfo.status === 3) return {
        success: false,
        msg: '兑换码已被兑换'
    }
    if (codeInfo.status !== 2) return {
        success: false,
        msg: '未知错误'
    }


    await db.collection('exchange_code').doc(codeInfo._id).update({
        data: {
            status: _.inc(1),
            exchangeOpenid: openid,
        }
    })

    let addMemberRes = await cloud.callFunction({
        name: 'addMember',
        data: {
            openid,
            addDay: getAddDayByExchangeCodeType(codeInfo.type)
        }
    })

    console.log('addMemberRes', addMemberRes);

    if (addMemberRes.result.success) {
        
        return {
            success: true,
            msg: '兑换成功'
        }
    } else {
        return {
            success: false,
            msg: '兑换失败',
            ...addMemberRes
        }
    }

}