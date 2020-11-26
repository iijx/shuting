const app = getApp()
const { Vant, UniApi, DB } = app;
app.createPage({
    data: {
        user: {},
        inviteNum: 0,
        remainNum: 10,
        isUsedFreeMember: false,
        config: {
            freeMemberNeedCount: 10
        },
        progressNote: '您已邀请 0 位好友，还差 10 位好友',
        
        isExchanging: false
    },
    onLoad: function (options) {
        
    },
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {
        DB.collection('weapp_share').where({ openid: this.data.user.openid }).get()
            .then(res => {
                console.log('res', res)
                let record = res.data[0];
                if (record) {
                    let num = record.invitedUser.length;
                    this.setData({
                        inviteNum: num,
                        isUsedFreeMember: record.isUsedFreeMember,
                        progressNote: `您已邀请 ${num} 位好友，` + `还差 ${Math.max(0, this.data.config.freeMemberNeedCount - num)} 位好友`
                    })
                } else {
                    this.setData({
                        inviteNum: 0,
                        isUsedFreeMember: false,
                        progressNote: `您已邀请 0 位好友，` + `还差 ${this.data.config.freeMemberNeedCount} 位好友`
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
        UniApi.appCloud('share', 'useFreeMember').then(res => {
            if (res.success) {
                UniApi.appCloud('user', 'get').then(res => {
                    app.Store.data.user = res;
                    this.update();
                });
            }
            Vant.Dialog.alert({
                message: res.message,
                confirmButtonColor: '#d93043'
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