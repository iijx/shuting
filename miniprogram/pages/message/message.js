// pages/message/message.js
const app = getApp();
const { UniApi, Store, CreateStoreBindings } = app;

Page({

    /**
     * Page initial data
     */
    data: {
        
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['defaultShareInfo', 'messages'],
            actions: ['setMessages'],
        })
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
        this.storeBindings.destroyStoreBindings()
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
        return this.data.defaultShareInfo;
    }
})