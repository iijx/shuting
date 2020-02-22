// pages/exchange/exchange.js
Page({

    /**
     * Page initial data
     */
    data: {
        value: ''
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (opt) {
        console.log('opt', opt)
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

    onChange() {

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