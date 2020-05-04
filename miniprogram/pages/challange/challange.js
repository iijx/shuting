// pages/challange/challange.js
const app = getApp();
const { Util, UniApi, XData, Vant, Store, CreateStoreBindings } = app;
Page({

    /**
     * Page initial data
     */
    data: {
        paying: false,
        qaList: [],
        rule: [],
        smallTitle: ''
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['systemInfo_platform'],
        })

        this.refreshData();
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    refreshData() {
        if (XData.challange.rule.length <= 0) {
            Util.sleep(1000).then(res => this.refreshData());
        } else {
            this.setData({
                qaList: XData.challange.qaList,
                rule: XData.challange.rule,
                smallTitle: XData.challange.smallTitle
            })
        }
    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {
        // 标记：已经点击过支付
        if (this.data.paying) {
            console.log('buy on show', app.globalData.paySuccess)
            Util.sleep(100).then(res => {
                console.log('buy on show 100', app.globalData.paySuccess)
                if (app.globalData.paySuccess) {
                    Vant.Toast.loading({
                        mask: true,
                        message: '查询支付中...'
                    });
                    let out_trade_no = app.globalData.out_trade_no
                    // 注意请求后端判断是否支付成功而非通过前端判断
                    let checkTimes = 0;
                    let that = this;
                    (function autoCheck() {
                        checkTimes += 1;
                        if (checkTimes >= 10) {
                            Vant.Toast.clear();
                            that.setData({ paying: false, })
                            return;
                        };
                        UniApi.cloud('getOrderStatus', {
                            out_trade_no,
                        }).then(res => {
                            if (String(res.status) === '2') {
                                Vant.Toast.clear();
                                UniApi.login().then(res => {
                                    Vant.Dialog.alert({
                                        title: '恭喜',
                                        message: '报名成功'
                                    }).then(res => {
                                        wx.switchTab({
                                          url: '../my/my',
                                        })
                                    })
                                })
                            } else {
                                Util.sleep(2000).then(res => autoCheck());
                            }
                        })
                    })();
                } else {
                    this.setData({ paying: false });
                    Vant.Dialog.confirm({
                        title: '提示',
                        message: '支付失败',
                        confirmButtonText: '重新支付',
                        cancelButtonText: '取消支付',
                    }).then(res => {
                        this.onSubmit();
                    }).catch(err => {
    
                    })
                }
            })
        }
    },
    onSubmit: Util.throttle(function() {
        Vant.Toast.loading({
            mask: true,
            message: '请求中...'
        });
        UniApi.cloud('createOrder', {
            memberType: '21',
            memberDay: 30,
        }).then(res => {
            Vant.Toast.clear();
            app.globalData.out_trade_no = res.out_trade_no;
            wx.navigateToMiniProgram({
                appId: 'wx959c8c1fb2d877b5',
                path: 'pages/pay',
                extraData: res,
                success: () => {
                  console.log('等待返回支付结果')
                  // 做已经点击过支付的标记
                  this.setData({
                      paying: true
                  })
                },
                fail: (err) => {
                    console.log('跳转err => ', err);
                  // 小程序跳转失败
                  // 做好错误处理
                }
              })
        })
    }, 1000),

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