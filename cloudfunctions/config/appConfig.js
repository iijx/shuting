
const START_TIME = new Date(2020, 2, 16); //202年3月16日 第一期开始
const WEEK_DAY = 7;

// 日期格式化
const dateFormatter = (date, formatter) => {
    date = date ? new Date(date) : new Date();
    const Y = date.getFullYear() + '',
          M = date.getMonth() + 1,
          D = date.getDate(),
          H = date.getHours(),
          m = date.getMinutes(),
          s = date.getSeconds();
    return formatter.replace(/YYYY|yyyy/g, Y)
                    .replace(/YY|yy/g, Y.substr(2, 2))
                    .replace(/MM/g, (M < 10 ? '0' : '') + M)
                    .replace(/DD/g, (D < 10 ? '0' : '') + D)
                    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
                    .replace(/mm/g, (m < 10 ? '0' : '') + m)
                    .replace(/ss/g, (s < 10 ? '0' : '') + s)
}
/**
 * 判断两个date之间的天数差
 * @param {*} dateInitial 
 * @param {*} dateFinal 
 */
const getDaysDiffBetweenDates = (dateInitial, dateFinal) => (dateFinal - dateInitial) / (1000 * 3600 * 24);

/**
 * 根据某一天，得到相对某一天的日期
 * @param {*} day 
 * @param {*} addDayNum 
 */
const getDateByAddDay = (day, addDayNum) => {
    let t = new Date(day)
    t.setDate(t.getDate() + addDayNum)
    return t
}

const getBasePeriodInfo = () => {
    let dayDiff = getDaysDiffBetweenDates(START_TIME, getToday());
    let periodNum =  Math.floor(dayDiff / WEEK_DAY) + 1;
    let curDayIndex =  (dayDiff + 1) % WEEK_DAY; // 从1开始
    let periodStart = getDateByAddDay(getToday(), -(curDayIndex - 1));
    let periodEnd = getDateByAddDay(getToday(), WEEK_DAY - curDayIndex);

    return {
        dayDiff,
        curDayIndex,
        periodNum,
        periodStart,
        periodEnd,
    }
}


const getToday = () => {
    let _day = new Date();
    _day.setHours(0, 0, 0, 0);
    return _day;
};

module.exports = {
    init: function() {
        const info = getBasePeriodInfo();
        this.activity[0].periodNum = info.periodNum;
        this.activity[0].periodStart = dateFormatter(new Date(info.periodStart), 'MM.DD');
        this.activity[0].periodEnd = dateFormatter(new Date(info.periodEnd), 'MM.DD');
    },
    goods: [
        {
            name: '月度会员 · 1月',
            isRecommend: false,
            price: 2.9,
            oldPrice: 15,
            memberType: '1',
            rank: 1,
        },
        {
            name: '半年会员 · 6月',
            isRecommend: false,
            price: 5.8,
            oldPrice: 45,
            memberType: '2',
            rank: 2,
        },
        {
            name: '永久会员',
            isRecommend: true,
            price: 9.6,
            oldPrice: 98,
            memberType: '3',
            rank: 3,
        },
    ],
    version: {
        onlineTime: '两周内',
        status: '开发中...',
        body: [
            '10. 4位数部分音频不全修复中...',
            '9. 学习数字键盘再调整【5/31已上线】',
            '8. 8位数9位数部分音频不全修复【5/12已上线】',
            '6. 学习数字键盘调整【5/12已上线】',
            '5. 小节重新排版【3/21已上线】',
            '4. 新增随机小节【3/21已上线】',
            '3. 新增月份与星期小节【3/15已上线】',
            '2. 新增小数点小节【3/15已上线】',
            '1. 新增年份小节【3/15已上线】',
        ]
    },
    memberBanner: {
        oldPrice: 1,
        price: 0.1,
        text: '会员仅 ¥0.1/天',
        btn: '立即查看',
        dialogPrompt: '会员专享，请先开通会员'
    },

    activity: [
        {
            title: '一周翻翻乐·赠会员',
            banner: '/assets/imgs/fanfanle_banner.png',
            btnText: '翻一翻',
            periodNum: 2,
            periodStart: '03.23',
            periodEnd: '03.29',
            type: 'fanfanle'
        }
    ],

    monitorRule: [
        '1. 邀请好友即可获得现金奖励。分享小程序给好友后，若好友参与月度会员计划、半年会员计划、终身会员计划，您可对应分别获得1元、2元、3元现金奖励;',
        '2. 现金奖励可在每周一申请结算;',
        '3. 若好友参与会员计划前同时与多人建立邀请关系，以第一次邀请关系为准，后续邀请无效。'

        // dev 版本
        // '1. 若想成为班长，可联系客服人员为你开通',
        // '2. 作为班长，邀请同学加入学习，班级所有学员均可获得奖励',
        // '3. 班级满10人，班长获得年度会员，所有班级成员获得月度会员奖励',
        // '4. 班级满50人，班长以及所有班级成员均获得终身会员奖励'
    ],

    challange: {
        qaList: [
            {
                q: '1. 完成挑战的标准？',
                a: '答: 20道测试题，答对19及以上即完成挑战，可返还全部报名费，20题全对同学额外奖励5元奖学金。'
            },
            {
                q: '2. 挑战测试题会不会很难？',
                a: '答: 挑战测试题全部来自练习题，包含数字1～6位，电话4，6，8位，年份，月份和24h时间。考虑到难度问题，7～9位的数字在测试中将不会出现，比练习题更简单。 '
            },
            {
                q: '3. 现金返现的形式是什么？',
                a: '答: 报名的同学，通过测试后，客服会1个工作日内核实数据，一般1个工作日内即可微信到账，最晚不超过2个工作日。'
            },
            {
                q: '4. 报名挑战是不是要先开通会员？',
                a: '答: 不需要，报名挑战的同学，挑战间期内将自动获得会员权限，无需另外开通会员。'
            },
            {
                q: '5. 可以提前测试或者延后测试么？',
                a: '答: 可以提前也可以延后，什么时候测试完成什么时候返现。但是给挑战者仅开通一个月的会员权益，时间宝贵，建议同学在一个月内完成噢。'
            },
            {
                q: '6. 如果测试未通过呢？',
                a: '答: 未通过将不会返现，但会赠送同学终身会员。'
            },
            {
                q: '7. 挑战活动是永久么',
                a: '答: 限于补贴成本，该挑战属于内测活动，试运营一个月，不定时关闭。已报名同学不会受到任何影响。'
            },
        ],
        rule: [
            '1. 挑战报名费35元',
			'2. 从报名日起，挑战者免费获得一个月会员权限，可练习任意小节。',
			'3. 报名参与挑战后，通过最后的20道测试题，答对19道及以上即可返还报名费35元，全部答对同学额外再奖励5元现金。',
        ],
        smallTitle: '4月本期补贴1万元'
        // qaList: [
        //     {
        //         q: '如有疑问',
        //         a: '请联系客服哈！'
        //     }
        // ],
        // rule: [
        //     '1. 作为班长，35元即可开启班级会员，邀请同学加入学习，班级所有学员均可获得奖励',
        //     '2. 班级满10人，所有班级成员获得月度会员奖励',
        //     '3. 班级满50人，所有班级成员均升级为终身会员奖励'
        // ],
        // smallTitle: '班长邀请挑战',
    },
    iosMemberPromptText: 'ios版请移至公众号',
    isShowIosMemberPrompt: true,


}


{/* <view>同学，你好，我是数听开发者。</view>
            <view>今天我想给大家发起一个挑战，内容是： 35元报名挑战，2周时间练习，通过数听测试即可返还现金35 + 5元奖学金，共返40元。</view>

            <view>1. 说明挑战之前先说说为什么要发起</view>

			<view>数字在英语听力中一直是考试中的常考点，可很多同学从初中，高中，甚至到了大学考四六级依然对简单到3位数的数字反应都会慢半拍，经常等反应过来读音已经读到后面去了。 </view>

            <view>为此，数听英语由此应运而生，通过刻意练习，为你一次性解决数字听力中反应慢的问题。</view>

            <view>但是呢，经过这一两个月的运营，发现有不少同学下定决心开始好好练习，也购买了会员，可是呢，却还是坚持不了，三天打鱼，两天晒网。</view>

            <view>为此，数听英语官方补贴，35元报名挑战，学成归来即可返还现金35 + 5元奖学金，共40元</view>  */}