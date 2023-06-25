
const Good = require('./models/good');


const GOODS = [
    new Good('1', 30, 12, 18).setRank(1), // 月会员
    new Good('2', 180, 9.6, 18), // 半年会员
    new Good('3', 36500, 30, 68).setName('数听永久会员').setRank(3), // 永久会员
    new Good('4', 365, 18, 33).setRecommend().setRank(5), // 1年会员
    new Good('6', 365 * 3, 18, 54), // 3年会员
    new Good('10', 0, 0, 0).setCustom(), // 自定义
    new Good('20', 365, 18, 200).setName('笃局会员pro').setRank(4), // 自定义
]

module.exports = {
    GOODS: [...GOODS],
    goods: GOODS.filter(i => ['4', '3'].includes(i.memberType)).sort((a, b) => a.rank - b.rank),
    version: {},
    freeMemberNeedCount: 10,
    // iosBuyPrompt: 'IOS小程序版，暂不支持开通',
    iosBuyPrompt: '会员专享内容，请先开通会员',
    // iosBuyPrompt: '会员专享内容，可至「数听英语」公众号下开通会员',
    isAppInCheck: false,
    // shareTimelineBaseImg: 'https://cdnword.iijx.site/assets/imgs/shuting/2020_11_15.png',
    androidWithDujuRate: 0,
    dujuRateWhiteList: [],
    copyText: '', 
    // likeRule: [
    //     { title: '活动规则', body: '满3位好友点赞了您的朋友圈，可升级为永久会员（不影响返现）。'},
    //     { title: '领取方式', body: '凭点赞截图，找客服升级。'},
    //     { title: '活动时间', body: '购买笃局会员后7天内。'},
    // ],
    moreMiniP: [
        { title: '闪题 · 高考、四六级真题练习', appid: 'wxd6392c3bfaad6162' },
        { title: '数听 · 日语版', appid: 'wx08b74a4a56324394' },
        // { title: '100种省钱方法', appid: 'wxcf148695ed647944' },
        // { title: '挑选有术', appid: 'wx936535a6fec653af' },
    ],
    awardPlan: [
        {
            memberType: 4,
            cash: 5,
        },
        {
            memberType: 3,
            cash: 8,
        },
    ]
}
