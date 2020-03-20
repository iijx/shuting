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
            isRecommend: true,
            price: 5.9,
            oldPrice: 98,
            memberType: 2,
            rank: 2,
        },
        {
            name: '终身永久会员',
            isRecommend: false,
            price: 9.7,
            oldPrice: 199,
            memberType: 3,
            rank: 3,
        },
    ],
    version: {
        onlineTime: '一周内',
        status: '开发中...',
        body: [
            '4. 新增随机位数小节【开发中...】',
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
            periodNum: 1,
            periodStart: '03.16',
            periodEnd: '03.22',
            type: 'fanfanle'
        }
    ],

    iosMemberPromptText: '',
    isShowIosMemberPrompt: true,
}