const app = getApp();
const { Util, UniApi, Vant, Store } = app;
app.createPage({
    data: {
        env: {},
        user: new app.Models.User({}),
        remainInviteCount: 0,
        awardedNum: 0,
        newMessageNum: 0,
        config: {},
        proEndDateStr: '',

        isShowMemberActivity: true
    },
    onLoad: function (options) {
        wx.nextTick(() => {
            if (!this.data.user.avatar) {
                wx.getSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            this.onGetUserInfo();
                        }
                    },
                    fail: err => {
                    }
                });
            }
        })
    },
    onReady: function () {

    },
    onShow: function () {
        this.update().then(() => {
            this.updateComputed()
        });
    },
    updateComputed() {
        if (this.data.user.proEndDate) {
            this.setData({
                proEndDateStr: Util.dateFormatter(new Date(this.data.user.proEndDate), 'YYYY/MM/DD')
            })
        }
    },
    memberDouble() {
        wx.navigateTo({
            url: '../memberDouble/memberDouble',
        })
    },
    memberBtn() {
        if (this.data.env.platform === 'android') {
            wx.navigateTo({
                url: '../buy/buy',
            })
        } else {
            console.log(this.data.config)
            Vant.Dialog.alert({
                title: '开通会员',
                message: this.data.config.iosBuyPrompt,
                confirmButtonText: '知道了',
                confirmButtonColor: '#4b51f2',
            }).then(() => {
                // on close
            });
        }
    },
    onGetUserInfo() {
        wx.getUserInfo({
            success: res => {
                app.Store.data.user.avatar = res.userInfo.avatarUrl;
                app.Store.data.user.nickName = res.userInfo.nickName;
                this.update().then(diff => this.updateComputed());
                UniApi.appCloud('user', 'update', {
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
    pageToMsg() {
        wx.navigateTo({
            url: '../message/message',
        })
    },
    link: function(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.path,
        })
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
        UniApi.appCloud('user', 'get').then(res => {
            Store.data.user = res;
            this.update();
        })
        Util.sleep(1000).then(() => wx.stopPullDownRefresh());
    },
    onReachBottom: function () {

    },
})