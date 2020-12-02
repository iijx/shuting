
const Good = require('./models/good');


const GOODS = [
    new Good('1', 30, 6, 9).setRank(1), // 月会员
    new Good('2', 180, 9.6, 18), // 半年会员
    new Good('3', 36500, 18, 68).setName('数听永久会员').setRank(3), // 永久会员
    new Good('4', 365, 9.6, 36).setActiviteNote('9月特惠 · 再赠90天').setRecommend().setRank(2), // 1年会员
    new Good('6', 365 * 3, 18, 54), // 3年会员
    new Good('10', 0, 0, 0).setCustom(), // 自定义
    new Good('20', 365, 20, 200).setName('笃局会员pro').setRank(4), // 自定义
]

module.exports = {
    GOODS: [...GOODS],
    goods: GOODS.filter(i => ['1', '3', '4', '20'].includes(i.memberType)).sort((a, b) => a.rank - b.rank),
    version: {},
    freeMemberNeedCount: 10,
    // iosBuyPrompt: 'IOS小程序版，暂不支持开通',
    iosBuyPrompt: '会员专享内容，请先开通会员',
    // iosBuyPrompt: '会员专享内容，可至「数听英语」公众号下开通会员',
    isAppInCheck: false,
    shareTimelineBaseImg: 'https://cdnword.iijx.site/assets/imgs/shuting/2020_11_15.png',
    androidWithDujuRate: 100,
    dujuRateWhiteList: []
}
