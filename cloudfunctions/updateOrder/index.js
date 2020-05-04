// 云函数入口文件
const cloud = require('wx-server-sdk')



// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const { 
        out_trade_no,
        status,
        time_end,
        payjs_order_id,
        transaction_id,
        openid
    } = event.POSTBODY || {};
    const wxContext = cloud.getWXContext()
    const order  = await db.collection('order').where({ out_trade_no }).limit(1).get().then(res => res.data[0]);

    if (!order) return {
        success: false,
        msg: '订单不存在'
    }

    if (order.status === status ) {
        return {
            success: true,
            msg: '无需修改'
        }
    }

    await db.collection('order').doc(order._id).update({
        data: {
            status: status,
            time_end,
            payjs_order_id,
            transaction_id,
            updateAt: new Date(),
        }
    });

    let user = await db.collection('users').where({ openid: order.openid }).limit(1).get().then(res => res.data[0]);

    let attach = JSON.parse(order.attach || '{}');
    if (!attach.memberDay) {
        console.log('错误该订单没有attach', event, order, user);
        return;
    }

    // 更改用户会员信息
    let proEndDate = Date.now() + attach.memberDay * 24 * 60 * 60 * 1000;
    let memberType = attach.memberType || -1;
    await db.collection('users').doc(user._id).update({
        data: {
            isPro: true,
            memberType: memberType,
            proEndDate,
            isMonitor: Number(memberType) === 3 || Number(memberType) === 2 ? true : false,
            updateAt: new Date(),
        }
    })

    // 如果有班长奖励
    let inviteRecord = await db.collection('invite').where({ _openid: order.openid }).limit(1).get().then(res => res.data[0]);
    if (inviteRecord) {
        let attach = typeof order.attach === 'string' ? JSON.parse(order.attach || '{}') : order.attach;
        let awardInfo = INVITE_AWARD.find(item => String(item.memberType) === String(attach.memberType)) || {};
        
        await db.collection('invite').doc(inviteRecord._id).update({data: {
            buyedMemberType: Number(attach.memberType),
            buyedMemberTitle: awardInfo.memberTitle,
            cashAward: awardInfo.cash,
            avatar: user.avatar,
            nickName: user.nickName,
            updateAt: Date.now()
        }})

        await db.collection('users').where( { openid: inviteRecord.inviter}).update({
            data: {
                totalMoney: _.inc(awardInfo.cash)
            }
        });
    }

    // 如果是挑战，生成一个挑战测试
    if ( String(memberType) === '21') {
        await db.collection('exam').add({
            openid: openid,
            status: 1,
            createAt: Date.now(),
            updateAt: Date.now(),
            answer: [],
            cNum: 0,
            isBackCash: false,
        })
    }
}

// 会员类型对应奖励
const INVITE_AWARD = [
    {
        memberType: 10,
        memberTitle: '自定义会员',
        cash: 0,
    },
    {
        memberType: 1,
        memberTitle: '月度会员',
        cash: 1,
    },
    {
        memberType: 2,
        memberTitle: '半年会员',
        cash: 2,
    },
    {
        memberType: 4,
        memberTitle: '年度会员',
        cash: 2,
    },
    {
        memberType: 3,
        memberTitle: '终身会员',
        cash: 3,
    },
]