// pages/my/my.js


const app = getApp();
const { Util, UniApi, Vant, Store, CreateStoreBindings } = app;

Page({
    /**
     * Page initial data
     */
    data: {
        remainInviteCount: 0,
        awardedNum: 0,

        CAN_AWARD_MIN_INVITE: 10,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['user', 'messages', 'newMessageNum', 'systemInfo', 'systemInfo_platform'],
            actions: ['setUser', 'setMessages'],
        });
        wx.nextTick(() => {
            if (!this.data.user.avatar) {
                wx.getSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            this.onGetUserInfo();
                        }
                    },
                    fail: err => {
                        console.log('暂未授权');
                    }
                });
            };
        })
        // wx.showLoading({
        //     title: '加载中...',
        // })
        // UniApi.cloud('updateShareAward').then(res => {
        //     this.setData({
        //         awardedNum: res.awardedNum,
        //         remainInviteCount: res.inviteeCount - res.usedInviteCount
        //     })
        //     UniApi.cloud('getMessage').then(res => {
        //         wx.hideLoading();
        //         this.setMessages(res.msgList.map(item => ({
        //             ...item,
        //             createdAt: new Date(item.createdAt),
        //             createdAtFormat: Util.dateFormatter(new Date(item.createdAt), "YYYY-MM-DD hh:mm:ss")
        //         })))
        //     }).catch(err => {
        //         wx.hideLoading();
        //     });
            
        // }).catch(err => {
        //     wx.hideLoading();
        // })

        
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    onShow: function () {
        UniApi.login();
    },
    onGetUserInfo() {
        wx.getUserInfo({
            success: res => {
                this.setUser({
                    avatar: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                });
                this.setData({user: this.data.user});
                UniApi.cloud('updateUserInfo', {
                    avatar: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                })
            }
        })
    },
    copyOpenid() {
        wx.setClipboardData({
            data: this.data.user.openid,
        })
    },

    openMemberBtn() {
        if (this.data.systemInfo_platform === 'android') {
            wx.navigateTo({
                url: '../buy/buy',
            })
        } else {
            wx.navigateTo({
                url: '../iosBuyPrompt/iosBuyPrompt',
            })
        }
       
    },
    freeMemberBtn() {
        Vant.Dialog.confirm({
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
        UniApi.login()
        Util.sleep(1000).then(() => wx.stopPullDownRefresh());
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
        return Store.defaultShareInfo;
    },
})