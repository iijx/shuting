const app = getApp();
const { Util, UniApi, Vant, Store } = app;
app.createPage({
    data: {
        env: { isSingleMode: false },
        user: new app.Models.User({}),
        remainInviteCount: 0,
        awardedNum: 0,
        newMessageNum: 0,
        config: {},
        proEndDateStr: '',

        isShowMemberActivity: true
    },
    onLoad: function (opt) {
        if (this.data.env.isSingleMode) return;
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
        app.learnLog();
    },
    onShow(opt) {
        if (this.data.env.isSingleMode) return;

        this.update().then(() => {
            this.updateComputed()
        });
        if (!this.data.user.isPro) {
            UniApi.appCloud('user', 'get').then(res => {
                app.Store.data.user = res;
                app.Store.update();
                this.updateComputed()
            });
        }
    },
    updateComputed() {
        if (this.data.user.proEndDate) {
            this.setData({
                proEndDateStr: Util.dateFormatter(new Date(this.data.user.proEndDate), 'YYYY/MM/DD')
            })
        }
    },
    toMyDuju() {
        wx.navigateTo({
            url: '../../subpack/myduju/myduju',
        })
    },
    toChecking() {
        wx.navigateTo({
            url: '../../subpack/checking/checking'
        })
    },
    toLongPro() {
        wx.navigateTo({
            url: '../../subpack/longPro/longPro'
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
                confirmButtonColor: '#d93043',
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
    link: function(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.path,
        })
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    toMiniP(e) {
        const appid = e.currentTarget.dataset.appid;
        wx.navigateToMiniProgram({
            appId: appid
        })
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