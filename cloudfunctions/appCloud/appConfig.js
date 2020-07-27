
const Good = require('./models/good');


const GOODS = [
    new Good('1', 30, 3.9, 6).setRank(1), // 月会员
    new Good('2', 180, 9.6, 18), // 半年会员
    new Good('3', 36500, 15, 68).setName('数听永久会员').setRank(3), // 永久会员
    new Good('4', 365, 9.6, 36).setActiviteNote('7月特惠 · 赠送90天').setRecommend().setRank(2), // 1年会员
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
            '9. 练习题功能开发中...',
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

    monitorRule: [
        // '1. 邀请好友即可获得现金奖励。分享小程序给好友后，若好友参与月度会员计划、半年会员计划、终身会员计划，您可对应分别获得1元、2元、3元现金奖励;',
        // '2. 现金奖励可在每周一申请结算;',
        // '3. 若好友参与会员计划前同时与多人建立邀请关系，以第一次邀请关系为准，后续邀请无效。'

        // dev 版本
        // '1. 若想成为班长，可联系客服人员为你开通',
        // '2. 作为班长，邀请同学加入学习，班级所有学员均可获得奖励',
        // '3. 班级满10人，班长获得年度会员，所有班级成员获得月度会员奖励',
        // '4. 班级满50人，班长以及所有班级成员均获得终身会员奖励'
    ],
    freeMemberNeedCount: 7,
    iosMemberPromptText: 'IOS小程序版，目前仅「数听英语」公众号下支持开通',
    iosBuyPrompt: 'IOS小程序版，目前仅「数听英语」公众号下支持开通',
    isAppInCheck: false
}
