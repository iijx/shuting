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
        proEndDate: new Date('1970-01-01'),
    },
    version: {},


    goods: [],

    iosMemberPromptText: 'IOS小程序版，暂不支持开通会员功能', // IOS小程序 · 暂不支持开通会员功能
    isShowIosMemberPrompt: false,
    monitorRule: [],
    memberBanner: {
        oldPrice: 2,
        price: 0.2,
        text: '/天 解锁全部',
        btn: '查看详情',
        dialogPrompt: '会员专享，请先开通会员'
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