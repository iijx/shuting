//index.js
const app = getApp()
const { Util, UniApi, Vant, Store, CreateStoreBindings } = app;
Page({
    data: {
    },
    onLoad: function() {
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['curLevel', 'curSubLevel', 'curSubLevelScore'],
        });
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
    // 用户点击右上角分享
    onShareAppMessage: function (res) {
        return Store.defaultShareInfo;
    },
    onUnload: function() {
        this.storeBindings.destroyStoreBindings()
    }
})