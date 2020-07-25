// pages/version/version.js

const app = getApp();
const { UniApi, Store } = app;
app.createPage({
    data: {
        list: [],
        config: {
            body: [],
            onlineTime: '',
            status: ''
        }
    },
    onLoad: function (options) {
        UniApi.cloud('advice', {
            operate: 'getAll',
        }).then(res => {
            this.setData({
                list: res.data.map(item => {
                    return {
                        ...item,
                        isLike: item.likeUserOpenid && item.likeUserOpenid.includes(Store.data.user.openid)
                    }
                }),
            })
        })
    },
    onReady: function () {

    },
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