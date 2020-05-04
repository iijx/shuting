//index.js
const app = getApp()
const { Util, UniApi, Vant, Store, CreateStoreBindings } = app;
Page({
    data: {
        isPro: false,
    },
    onLoad: function() {
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['curLevel', 'curSubLevel', 'curSubLevelScore', 'systemInfo_platform'],
        });

    },
    onShow() {
        this.setData({
            isPro: Store.user.isPro
        })
    },
    toLearn() {
        if(Store.curSubLevelList.length <= 0) {
            wx.switchTab({
                url: '../level/level',
            })
        } else {
            wx.redirectTo({
                url: '../learn/learn',
            })
        }
    },
    linkToGiveRuler() {
        wx.navigateTo({
          url: '../giveRule/giveRuler',
        });
    },
    linkToChallange() {
        wx.navigateTo({
          url: '../challange/challange',
        });
    },
    linkToActivity() {
        wx.navigateTo({
          url: '../activity/activity',
        })
    },
    // 用户点击右上角分享
    onShareAppMessage: function (res) {
        return Store.defaultShareInfo;
    },
    onUnload: function() {
        this.storeBindings.destroyStoreBindings()
    }
})