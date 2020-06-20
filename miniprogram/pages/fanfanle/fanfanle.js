// pages/fanfanle/fanfanle.js
const app = getApp();
const { Util, UniApi, XData, Vant, Store, CreateStoreBindings } = app;

Page({
    /**
     * Page initial data
     */
    data: {
        active: false,
        isShowCardDialog: false,
        awardImg: '',
        periodTimeStr: '　',
        periodNum: '　',
        cardList: [],
        unOpenNum: '　',
        sharedUserOpenid: [],
        isShowUnLockCardDialog: false,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        UniApi.cloud('fanfanle', {
            operate: 'getPeriodInfo'
        }).then(res => {
            this.setData({
                cardList: res.awardList.map(item => ({...item, isOpened: Boolean(item.isOpened)})),
                periodTimeStr: Util.dateFormatter(res.periodStart, 'MM.DD') + ' - ' + Util.dateFormatter(res.periodEnd, 'MM.DD'),
                periodNum: res.periodNum,
                unOpenNum: res.awardList.filter(item => !item.isOpened).length,
                sharedUserOpenid: res.sharedUserOpenid,
            })
        })
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },
    getMemberCard() {
        this.setData({
            isShowCardDialog: false,
            active: false
        })
    },
    openCard(e) {
        let { index } = e.currentTarget.dataset;
        let card = {...this.data.cardList[index]}
        if (card.isOpened) return;

        if (this.data.sharedUserOpenid.length <= 0 && this.data.unOpenNum <= 1) {

            this.setData({
                isShowUnLockCardDialog: true,
            })

        } else {
            UniApi.cloud('fanfanle', {
                operate: 'openCard',
                ...card
            });
            card.isOpened = true;
            this.data.cardList.splice(index, 1, card);
            this.setData({
                isShowCardDialog: true,
                cardList: this.data.cardList,
                unOpenNum: this.data.unOpenNum - 1,
                awardImg:  card.memberDay >= 1 ? '/assets/imgs/activity/card-member-1.png' : '/assets/imgs/activity/card-member-.5.png'
            })
            Util.sleep(400).then(() => {
                this.setData({
                    active: true,
                })
            })
        }
    },
    closeUnlockDialog() {
        this.setData({
            isShowUnLockCardDialog: false
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
        let info = Store.defaultShareInfo;
        let res = {
            ...info,
            path: info.path + `&fflCardShareOpenid=${Store.user.openid}`,
        }
        return res;
    }
})