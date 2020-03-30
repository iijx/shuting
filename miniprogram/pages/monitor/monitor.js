

// pages/monitor/monitor.js
const app = getApp();
const { Util, XData, UniApi, Vant, Store, DB, CreateStoreBindings } = app;
Page({
    data: {
        userIsMonitor: false, 

        noteList: [],
        totalMoney: 0,
        usedMoney: 0,
        remainMoney: 0,

        inviteList: []
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        this.setData({
            totalMoney: Store.user.totalMoney || 0,
            usedMoney: Store.user.usedMoney || 0,
            remainMoney: (Store.user.totalMoney || 0) - (Store.user.usedMoney || 0)
        });

        // console.log(` DB.collection('invite').where({ inviter: ${Store.user.openid}, }).get()`)
        DB.collection('invite').where({ inviter: Store.user.openid, }).get().then(res => {
            console.log(res);
            this.setData({
                inviteList: res.data.filter(item => item.buyedMemberType).map(item => ({
                    ...item,
                    nickName: (item.nickName && item.nickName.length >= 4) ? (item.nickName.slice(0, 3) + '...') : (item.nickName || ''),
                    createAt: Util.dateFormatter(item.createAt, 'MM-DD hh:mm'),
                }))
            })
        })
    },
    onShow() {
        this.setData({
            noteList: XData.monitorRule || [],
            userIsMonitor: Store.user.isMonitor
        })
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    useBtn() {
        if (this.data.remainMoney < 5) {
            Vant.Notify({ type: 'warning', message: '至少5元方可申请'})
        } else {
            Vant.Dialog.alert({
                title: '班长您好',
                confirmButtonText: '知道了',
            }).then(() => {
            // on close
            });
        }
    },

    onShareAppMessage: function (res) {
        return Store.defaultShareInfo;
    },
})