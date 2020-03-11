// pages/giveRule/giveRuler.js
const app = getApp();
const { Util, XData, UniApi, Vant, Store, CreateStoreBindings } = app;

Page({

    /**
     * Page initial data
     */
    data: {
        ...XData.create(['iosMemberPromptText', 'isShowIosMemberPrompt'])
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        this.setData( XData.create(['iosMemberPromptText', 'isShowIosMemberPrompt']));

        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['user', 'systemInfo_platform'],
        });
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
    openMemberBtn() {
        if (Store.systemInfo_platform === 'android') {
            wx.navigateTo({
                url: '../buy/buy',
            })
        } else {
            Vant.Dialog.alert({
                title: 'Sorry',
                confirmButtonText: '知道了',
              }).then(() => {
                // on close
              });
        }
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