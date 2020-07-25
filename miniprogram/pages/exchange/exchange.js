// pages/exchange/exchange.js
const app = getApp();
const { Util, UniApi, Vant } = app;
Page({

    /**
     * Page initial data
     */
    data: {
        value: '',
        isExchanging: false,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (opt) {
        if(opt && opt.code) {
            this.setData({
                value: opt.code.trim()
            })
        }
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

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
        
        UniApi.cloud('exchangeCode', { code: this.data.value })
            .then(res => {
                this.setData({ isExchanging: false })
                if (res.success) {
                    Vant.Dialog.alert({
                        message: '您已兑换成功'
                    })
                    UniApi.login();
                } else {
                    Vant.Dialog.alert({
                        message: res.msg || '兑换失败 ｜ 未知错误'
                    })

                }
            })
    }, 1000),

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {

    }
})