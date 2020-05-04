// pages/exam/exam.js
const app = getApp();
const {
    Util,
    XData,
    UniApi,
    DB,
    Vant,
    Store,
    CreateStoreBindings
} = app;
// 在页面中定义激励视频广告
let videoAd = null


Page({

    /**
     * Page initial data
     */
    data: {
        examList: []
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {

        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-0e2f6b778907b37e'
            })
            videoAd.onLoad(() => {console.log('load')})
            videoAd.onError((err) => {console.log('error')})
            videoAd.onClose((res) => {
                if(res && res.isEnded) {
                    wx.navigateTo({
                        url: `../examing/examing?mode=mockExam`,
                    })
                }
            })
        }

       
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    startMockExam() {
         // 用户触发广告后，显示激励视频广告
         if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                        console.log('激励视频 广告显示失败')
                    })
            })
        }
        
    },
    startExam(e) {
        let {
            examid
        } = e.currentTarget.dataset;
        console.log(examid, e)
        wx.navigateTo({
            url: `../examing/examing?mode=exam&examId=${examid}`,
        })
    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {
        DB.collection('exam').where({
            openid: Store.user.openid,
        }).get({
            success: res => {
                console.log(res);
                let list = res.data.map(item => {
                    return {
                        ...item,
                        statusText: Number(item.status) === 1 ? '待测试' : `正确${item.cNum}题，错误${20-item.cNum}题`,
                        createStr: Util.dateFormatter(new Date(item.createAt), 'YYYY-MM-DD'),
                        isComplete: Number(item.status) === 2
                    }
                });

                this.setData({
                    examList: list
                })

            }
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