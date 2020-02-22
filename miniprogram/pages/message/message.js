// pages/message/message.js
Page({

    /**
     * Page initial data
     */
    data: {
        list: [
            {
                type: 'exchangeCode',
                title: '限时分享活动奖励',
                content: '恭喜您获得在【限时分享活动】中获得一周会员奖励，会员兑换码为1234',
                exchangeCode: '1234',
                status: 1 // 1 未使用，2 已经使用

            }
        ]
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {

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

    linkExchangeCode(e) {
        wx.redirectTo({
            url: '../exchange/exchange?code=' + e.currentTarget.dataset.code,
        })
    },
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