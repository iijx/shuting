// pages/summary/summary.js
const app = getApp();
const {
    Util,
    Config,
    UniApi,
    Vant,
    Store,
    CreateStoreBindings
} = app;

let AudioContext = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cNum: 0,
        scoreAwardText: '',
    },
    onLoad: function (opt) {
        let { mode, cNum, examId } = opt;

        let scoreAwardText = ''
        if (cNum >= 20) scoreAwardText = '报名费全返 + ¥5奖学金'
        else if (cNum >= 19) scoreAwardText = '报名费全返'
        else scoreAwardText = '挑战失败'

        this.setData({
            cNum,
            mode,
            scoreAwardText
        })

        if (mode === 'exam') {
            UniApi.cloud('exam', {
                operate: 'answer',
                examId,
                cNum,
            })
        }
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
        
    },
    toLearnNextSubLevel() {
        wx.redirectTo({
            url: '../learn/learn',
        })
    },
    toIndex() {
        wx.switchTab({
            url: '../index/index',
        });
    },
    lookAllBtn() {
        wx.switchTab({
            url: '../my/my',
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    onUnload: function () {
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