const app = getApp()
const { Vant, UniApi, DB } = app;
app.createPage({
    data: {
        user: {},
        inviteNum: 0,
        remainNum: 10,
        isUsedMemberDouble: false,
        progressNote: '您已邀请 0 位好友，还差 * 位好友',
        
        isExchanging: false,
        time: 30 * 60 * 60 * 1000
    },
    onLoad: function (options) {
        
    },
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {
        DB.collection('weapp_share').where({ openid: this.data.user.openid }).get()
            .then(res => {
                let record = res.data[0];
                if (record) {
                    let num = record.invitedUser.length;
                    this.setData({
                        inviteNum: num,
                        isUsedMemberDouble: record.isUsedMemberDouble || false,
                        progressNote: `您已邀请 ${num} 位好友，` + `还差 ${Math.max(0, 3 - num)} 位好友`
                    })
                } else {
                    this.setData({
                        inviteNum: 0,
                        isUsedMemberDouble: false,
                        progressNote: `您已邀请 0 位好友，` + `还差 3 位好友`
                    })
                }
            });
    },
    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },
    getFreeMember() {
        if (this.data.isExchanging) return;

        this.setData({ isExchanging: true })
        UniApi.appCloud('share', 'useMemberDouble').then(res => {
            if (res.success) {
                UniApi.appCloud('user', 'get').then(res => {
                    app.Store.data.user = res;
                    this.update();
                });
            }
            Vant.Dialog.alert({
                message: res.message,
                confirmButtonColor: '#4b51f2'
            }).then(res => {
                wx.navigateBack({ delta: 1 })
            });
        })
    },

    itemClick(e) {
        let { type } = e.currentTarget.dataset;
        if (type === 'fanfanle') {
            wx.navigateTo({
              url: '../fanfanle/fanfanle',
            })
        }
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
})