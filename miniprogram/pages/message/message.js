// pages/message/message.js
const app = getApp();
const { UniApi, Store } = app;

Page({
    data: {
        messages: []
    },
    onLoad: function (options) {
      
    },
    onReady: function () {

    },
    onShow: function () {

    },

    linkExchangeCode(e) {
        wx.redirectTo({
            url: '../exchange/exchange?code=' + e.currentTarget.dataset.code,
        })
    },
    onHide: function () {

    },
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
        // return this.data.defaultShareInfo;
    }
})