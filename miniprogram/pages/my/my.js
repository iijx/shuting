// pages/my/my.js


const app = getApp();
const { Util, UniApi, Vant, Store, CreateStoreBindings } = app;

Page({
    /**
     * Page initial data
     */
    data: {
        avatarUrl: '../../assets/imgs/user-unlogin.png',
        userInfo: {},
        remainInviteCount: 0,
        awardedNum: 0,

        CAN_AWARD_MIN_INVITE: 3,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['defaultShareInfo', 'user', 'messages', 'newMessageNum'],
            actions: ['setUser', 'setMessages'],
        })
        wx.showLoading({
            title: '加载中...',
        })
        UniApi.cloud('updateShareAward').then(res => {
            this.setData({
                awardedNum: res.awardedNum,
                remainInviteCount: res.inviteeCount - res.usedInviteCount
            })
            UniApi.cloud('getMessage').then(res => {
                wx.hideLoading();
                this.setMessages(res.msgList.map(item => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    createdAtFormat: Util.dateFormatter(new Date(item.createdAt), "YYYY-MM-DD hh:mm:ss")
                })))
            }).catch(err => {
                wx.hideLoading();
            });
            
        }).catch(err => {
            wx.hideLoading();
        })

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
        });
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    // getActivityMember: function() {
    //     const db = wx.cloud.database()
    //     db.collection('users').doc(this.user._id).get()
    //         .then(res => {
    //             console.log('user', res);
    //             if (!res.data.isGetedActivityMember) {
    //                 console.log(1);
    //                 wx.cloud.callFunction({
    //                     name: 'addMemberActivity',
    //                     data: {
    //                         addDay: 30
    //                     },
    //                     success: res => {
    //                         console.log('addMemberActivity res', res);
    //                     }
    //                 })

    //             } else {
    //                 console.log(2);
    //             }
    //         })
        
    // },

    onShow: function () {
        Util.sleep(100).then(res => this.setData({user: this.data.user}));
    },

    openMemberBtn() {
        // wx.navigateTo({
        //     url: '../buy/buy',
        // })
       
    },
    freeMemberBtn() {
        Vant.Dialog.confirm({
            message: '兑换失败 ｜ 未知错误',
            confirmButtonText: '查看客服',
            cancelButtonText: '关闭',
            confirmButtonOpenType: 'contact'
        }).then(() => {

        }).catch(err => {

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
   
    onShareAppMessage: function (res) {
        return this.defaultShareInfo;
    },
})