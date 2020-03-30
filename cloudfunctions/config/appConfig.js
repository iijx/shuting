module.exports = {
    goods: [
        {
            name: '月度会员 · 1月',
            isRecommend: false,
            price: 2.9,
            oldPrice: 10,
            memberType: 1,
            rank: 1,
        },
        {
            name: '半年会员 · 6月',
            isRecommend: false,
            price: 5.8,
            oldPrice: 98,
            memberType: 2,
            rank: 2,
        },
        {
            name: '终身永久会员',
            isRecommend: true,
            price: 9.6,
            oldPrice: 199,
            memberType: 3,
            rank: 3,
        },
    ],
    version: {
        onlineTime: '两周内',
        status: '开发中...',
        body: [
            '6. 下一版本功能规划中...',
            '5. 小节重新排版【3/21已上线】',
            '4. 新增随机小节(地狱王者模式)【3/21已上线】',
            '3. 新增月份与星期小节【3/15已上线】',
            '2. 新增小数点小节【3/15已上线】',
            '1. 新增年份小节【3/15已上线】',
        ]
    },
    memberBanner: {
        oldPrice: 1,
        price: 0.1,
        text: '会员仅 ¥0.1/天',
        btn: '立即查看'
    },

    activity: [
        {
            title: '一周翻翻乐',
            banner: '/assets/imgs/fanfanle_banner.png',
            btnText: '翻一翻',
            periodNum: 2,
            periodStart: '03.23',
            periodEnd: '03.29',
            type: 'fanfanle'
        }
    ],

    monitorRule: [
        // '1. 邀请好友即可获得现金奖励。分享小程序给好友后，若好友24小时内参与月度会员计划、半年会员计划、终身会员计划，您可对应分别获得1元、3元、5元现金奖励;',
        // '2. 现金奖励可在每周一申请结算;',
        // '3. 若好友参与会员计划前同时与多人建立邀请关系，以第一次邀请关系为准，后续邀请无效。'

        // dev 版本
        '1. 若想成为班长，可联系客服人员为你开通',
        '2. 作为班长，邀请同学加入学习，班级所有学员均可获得奖励',
        '3. 班级满10人，班长获得年度会员，所有班级成员获得月度会员奖励',
        '4. 班级满50人，班长以及所有班级成员均获得终身会员奖励'
    ],
    iosMemberPromptText: '',
    isShowIosMemberPrompt: true,
}