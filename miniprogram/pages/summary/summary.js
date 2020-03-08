// pages/summary/summary.js
const app = getApp();
const { Util, Config, UniApi, Vant, Store, CreateStoreBindings } = app;

let AudioContext = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        levelTitle: '',
        // canNextSubLevel: {
        //     success: false,
        //     msg: ''
        // },
    },
    onLoad: function (opt) {
        AudioContext = wx.createInnerAudioContext();
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['defaultShareInfo', 'user', 'curLevel', 'curSubLevelId', 'curSubLevel', 'curSubLevelList', 'subLevelLearnedMap'],
            actions: ['autoNextSubLevel']
        });

        Util.sleep(200).then(() => {
            this.setData({
                levelTitle: this.data.curLevel.title + ' · 小节' + this.data.curSubLevel.index 
            })

            // 自动学习下一个小节
            this.autoNextSubLevel();
            // this.setData({
            //     canNextSubLevel
            // })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        Util.sleep(200).then(() => {
            AudioContext.src = '/assets/audio/win.m4a';
            AudioContext.play();
        })
    },
    toLearnNextSubLevel() {
        wx.redirectTo({
            url: '../learn/learn',
        })
        // if (this.data.canNextSubLevel.success) {
        // } else {
        //     Vant.Dialog.alert({
        //         message: this.data.canNextSubLevel.msg,
        //     })
        // }
    },
    toIndex() {
        wx.switchTab({
          url: '../index/index',
        });
    },
    lookAllBtn() {
        wx.switchTab({
          url: '../level/level',
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    onUnload: function () {
        this.storeBindings.destroyStoreBindings()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    onShareAppMessage: function (res) {
        return this.data.defaultShareInfo;
    },
})