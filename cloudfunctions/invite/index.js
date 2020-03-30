// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const DB = cloud.database();

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
        cash: 3,
    },
    {
        memberType: 4,
        memberTitle: '年度会员',
        cash: 3,
    },
    {
        memberType: 3,
        memberTitle: '终身会员',
        cash: 5,
    },
]

const invite = async(inviterOpenid, openid) => {
    if (!inviterOpenid) return {
        success: false,
        msg: 'inviterOpenid参数错误'
    };
    if (openid === inviterOpenid) return {
        success: false,
        msg: '不能邀请自己'
    };


    let user = await DB.collection('users').where({ openid: inviterOpenid }).get().then(res => res.data[0]);
    if(user && user.isMonitor) {
        let record = await DB.collection('invite').where({ inviter: inviterOpenid}).get().then(res => res.data[0]);
        // 如果有记录
        if (record) {
            // 并且记录里的邀请列表里没有包含了此openid
            if (record.invitee.findIndex(item => item.openid === openid) === -1) {
                await DB.collection('invite').doc(record._id).update({
                    data: {
                        invitee: [ new Invitee({openid})],
                        updateAt: Date.now()
                    }
                })
            } else ;

        } else {
            await DB.collection('invite').add({
                data: {
                    inviter: inviterOpenid,
                    invitee: [ new Invitee({openid})],
                    totalMoney: 0,
                    usedMoney: 0,
                    remainMoney: 0,
                    createdAt: Date.now(),
                    updateAt: Date.now()
                },
            })
        }
        
    }

    return {
        success: true
    }
}

const getInviteList = async (inviterOpenid) => {
    console.log(`DB.collection('invite').where({ inviter: ${inviterOpenid}})`);
    let record = await DB.collection('invite').where({ inviter: inviterOpenid}).get().then(res => res.data[0]);
    console.log('record', record);

    if (record) {
        return {
            success: true,
            ...record
        }
    } else {
        return {
            success: false,
            msg: '暂无记录'
        }
    }
}


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { operate, inviterOpenid } = event;
    let openid = event.openid || wxContext.OPENID;
    

    if (operate === 'invite') {
        return await invite(inviterOpenid, openid);
    }

    if (operate === 'getInviteList') {
        return await getInviteList(inviterOpenid);
    }
   
}

class Invitee {
    constructor(opt) {
        this.openid = opt.openid;
        this.avatar = '';
        this.nickname = '';
        this.buyedMemberType = -1;
        this.buyedMemberTitle = '';
        this.cashAward = 0;
        
        this.createAt = Date.now();
        this.updateAt = Date.now();
    }
}