// pages/version/version.js

const app = getApp();
const { Util, UniApi, Vant, XData, Store, CreateStoreBindings } = app;
Page({

    /**
     * Page initial data
     */
    data: {
        list: [],
        ...XData.create(['version']),
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        this.setData(XData.create(['version']))
        UniApi.cloud('advice', {
            operate: 'getAll',
        }).then(res => {
            this.setData({
                list: res.data.map(item => {
                    return {
                        ...item,
                        isLike: item.likeUserOpenid && item.likeUserOpenid.includes(Store.user.openid)
                    }
                }),
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
    toAdvice() {
        wx.navigateTo({
          url: '../advice/advice',
        })
    },
    likeBtn(e) {
        let index = e.currentTarget.dataset.index;
        let item = {...this.data.list[index]};
        item.likeNum += (item.isLike ? -1 : 1);
        item.isLike = !item.isLike;
        UniApi.cloud('advice', {
            operate: item.isLike ? 'like' : 'unlike',
            adviceId: item._id,
        })

        
        this.data.list.splice(index, 1, item);

        this.setData({
            list: this.data.list
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

    }
})