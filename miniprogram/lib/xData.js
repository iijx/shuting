var cloneObj = function(obj){
    if(typeof obj !== 'object'){
        return obj;
    } else {
        let str = JSON.stringify(obj); //系列化对象
        return JSON.parse(str); //还原
    }
};

export default {
    user: {
        _id: '',
        isPro: false,
        openid: '',
        avatar: '',
        nickName: '',
        proBeginDate: new Date('1970-01-01'),
        proEndDate: new Date('1970-01-01'),
    },
    version: {},


    goods: [
        {
            name: '月度会员 · 30天',
            isRecommend: false,
            price: 4.9,
            oldPrice: 10,
            memberType: 1,
            rank: 1,
        },
        {
            name: '半年会员 · 180天',
            isRecommend: false,
            price: 7.8,
            oldPrice: 19,
            memberType: 2,
            rank: 2,
        },
        {
            name: '终身会员 · 100年',
            isRecommend: true,
            price: 9.7,
            oldPrice: 19,
            memberType: 3,
            rank: 3,
        },
    ],

    iosMemberPromptText: 'IOS小程序版，暂不支持开通会员功能', // IOS小程序 · 暂不支持开通会员功能
    isShowIosMemberPrompt: false,
    monitorRule: [],
    memberBanner: {
        oldPrice: 2,
        price: 0.1,
        text: '/天 解锁全部',
        btn: '查看详情'
    },

    challange: {
        qaList: [],
        rule: [],
        smallTitle: ''
    },

    create(fileds = []) {
        let that = this;
        const a = fileds.reduce((ac, cur) => {
            ac[cur] = cloneObj(that[cur])
            return ac;
        }, {});
        return a;
    }
}