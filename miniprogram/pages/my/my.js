// pages/my/my.js


const app = getApp();
const { Util, XData, UniApi, Vant, Store, CreateStoreBindings } = app;
// 在页面中定义激励视频广告
let videoAd = null

Page({
    data: {
        remainInviteCount: 0,
        awardedNum: 0,

        CAN_AWARD_MIN_INVITE: 10,

        ...XData.create(['iosMemberPromptText', 'isShowIosMemberPrompt']),

        proEndDateStr: ''
    },
    onLoad: function (options) {
        this.setData( XData.create(['iosMemberPromptText', 'isShowIosMemberPrompt']))
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['user', 'messages', 'newMessageNum', 'systemInfo_platform'],
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
                        // console.log('暂未授权');
                    }
                });
            };

            this.setData({
                proEndDateStr: Util.dateFormatter(this.data.user.proEndDate, 'YYYY/MM/DD')
            })
        })
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-0e2f6b778907b37e'
            })
            videoAd.onLoad(() => {console.log('load')})
            videoAd.onError((err) => {console.log('err', err)})
            videoAd.onClose((res) => {
                if(res && res.isEnded) {
                    UniApi.cloud('addMember', {
                        addDay: 1
                    }).then(res => {
                        this.relogin(true);
                        wx.showToast({
                            title: '已获赠1天会员',
                            icon: 'success',
                            duration: 1500
                        })
                    })
                }
            })
        }

        
    },
    onReady: function () {

    },
    onShow: function () {
        wx.nextTick(() => {
            this.relogin();
        })
    },
    relogin(mustRequest = false) {
        if (mustRequest || !this.data.user.isPro) {
            UniApi.login().then(res => {
                this.setData({ 
                    user: this.data.user,
                    proEndDateStr: Util.dateFormatter(this.data.user.proEndDate, 'YYYY/MM/DD')
                })
            });
        }
    },
    memberBtn() {
        if (this.data.systemInfo_platform === 'android') {
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
    lookAd() {
        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                        // console.log('激励视频 广告显示失败')
                    })
            })
        }
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
        if (Store.systemInfo_platform === 'android') {
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