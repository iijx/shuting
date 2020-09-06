
const Good = require('./models/good');


const GOODS = [
    new Good('1', 30, 4.9, 6).setRank(1), // 月会员
    new Good('2', 180, 9.6, 18), // 半年会员
    new Good('3', 36500, 17, 68).setName('数听永久会员').setRank(3), // 永久会员
    new Good('4', 365, 9.6, 36).setActiviteNote('8月特惠 · 再赠90天').setRecommend().setRank(2), // 1年会员
    new Good('6', 365 * 3, 18, 54), // 3年会员
    new Good('10', 0, 0, 0).setCustom(), // 自定义
]

module.exports = {
    oneDayPrice: 0.2,
    GOODS: [...GOODS],
    goods: GOODS.filter(i => ['1', '3', '4'].includes(i.memberType)).sort((a, b) => a.rank - b.rank),
    version: {
        onlineTime: '两周内',
        status: '开发中...',
        body: [
            // '9. 练习题功能开发中...',
            '8. UI 重新改版...【7/25】',
            '7. 修复小部分4位数音频【6/12】',
            '6. 学习数字键盘再调整【5/31】',
            '5. 小节重新排版【3/21】',
            '4. 新增随机小节【3/21】',
            '3. 新增月份与星期小节【3/15】',
            '2. 新增小数点小节【3/15】',
            '1. 新增年份小节【3/15】',
        ]
    },
    freeMemberNeedCount: 10,
    iosBuyPrompt: 'IOS小程序版，暂不支持开通',
    // iosBuyPrompt: 'IOS小程序版目前仅「数听英语」公众号下支持开通',
    isAppInCheck: false
}
