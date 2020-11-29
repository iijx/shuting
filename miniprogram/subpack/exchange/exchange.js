// pages/exchange/exchange.js
const app = getApp();
const { Util, UniApi, Vant } = app;
Page({
    data: {
        value: '',
        isExchanging: false,
    },
    onLoad: function (opt) {
        if(opt && opt.code) {
            this.setData({
                value: opt.code.trim()
            })
        }
    },
    onChange(e) {
        this.setData({
            value: e.detail
        })
    },

    exchange: Util.throttle(function(){
        if (!this.data.value) {
            Vant.Toast('请输入兑换码');
            return;
        };
        if (this.data.isExchanging) return;

        this.setData({ isExchanging: true })
        
        UniApi.appCloud('excCode', 'use', { code: this.data.value })
        // UniApi.cloud('exchangeCode', { code: this.data.value })
            .then(res => {
                this.setData({ isExchanging: false })
                if (res.success) {
                    Vant.Dialog.alert({
                        message: '您已兑换成功'
                    })
                    UniApi.appCloud('user', 'get').then(res => {
                        app.Store.data.user = res;
                        app.Store.update();
                    });
                } else {
                    Vant.Dialog.alert({
                        message: res.msg || '兑换失败 ｜ 未知错误'
                    })

                }
            })
    }, 1000),
})