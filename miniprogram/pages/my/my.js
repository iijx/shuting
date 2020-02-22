// pages/my/my.js

const app = getApp();
const { XData } = app;

Page({
    /**
     * Page initial data
     */
    data: {
        avatarUrl: '../../assets/imgs/user-unlogin.png',
        userInfo: {},
        progressValue: 10,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                        }
                    })
                }
            },
            fail: err => {
                console.log('暂未授权');
            }
        })
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    getActivityMember: function() {
        const db = wx.cloud.database()
        db.collection('users').doc(XDAta.user._id).get()
            .then(res => {
                console.log('user', res);
                if (!res.data.isGetedActivityMember) {
                    console.log(1);
                    wx.cloud.callFunction({
                        name: 'addMemberActivity',
                        data: {
                            addDay: 30
                        },
                        success: res => {
                            console.log('addMemberActivity res', res);
                        }
                    })

                } else {
                    console.log(2);
                }
            })
        
    },

    onShow: function () {

    },

    openMemberBtn() {
        wx.navigateTo({
            url: '../buy/buy',
        })
    },
    pageToMsg() {
        wx.navigateTo({
            url: '../message/message',
        })
    },
    link: function(e) {
        console.log(e);
        wx.navigateTo({
            url: e.currentTarget.dataset.path,
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
        wx.showToast({
            title: 'my unload',
        })
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

    },
    onShareAppMessage: function (res) {
        return XData.getShareInfo();
    },
})