// pages/buy/buy.js
const app = getApp();
const { Util, UniApi, XData, Vant, Store, CreateStoreBindings } = app;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        memberType: "3",
        price: 0,
        paying: false,
        signUpNumber: 10,
        systemInfo_platform: '',
        isShowGiveDialog: false,
        memberDay: 60,
        memberDayPrice: 600,
        ...XData.create(['goods']),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData(XData.create(['goods']));


        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['systemInfo_platform'],
        })
        this.updateSignUpNumber();

        wx.nextTick(() => {
            let defaultGood = this.data.goods.find(item => item.isRecommend);
            this.setData({
                price: defaultGood.price * 100,
                memberType: String(defaultGood.memberType)
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
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
                                        message: '开通成功'
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
    updateSignUpNumber() {
        let baseBumber = 10;
        let everyDayAdd = 2;
        let baseDate = new Date("2020-03-01T16:00:00.000Z").getTime();
        let now = Date.now();
        let time = (now - baseDate) / 1000; // 间隔秒数

        let day = parseInt(time / (24 * 60 * 60));
        let hour = parseInt((time - day * (24 * 60 * 60)) / 3600);
        let retNum = baseBumber + day * everyDayAdd;
        console.log(day, hour);
        retNum += hour <= 6 ? 8 * hour : 22 + 6 * (hour - 6);
        retNum += this.randomNum(0, 3);
        this.setData({
            signUpNumber: parseInt(Number(retNum))
        })
    },
    onMemberDayChange(e) {
        let day = e.detail.value || e.detail;
        let dayPrice = day * 10;
        this.setData({
            memberDay: day,
            memberDayPrice: dayPrice
        });
        if (this.data.memberType === '10') {
            this.setData({
                price: dayPrice
            })
        }
    },
    giveRuleBtn() {
        this.setData({ isShowGiveDialog: true })
    },
    randomNum(min, max) {
        return Math.random() * (max - min) + min;
    },
    memberDayCellClick() {
        this.setData({
            memberType: "10",
            price: this.data.memberDayPrice
        })
    },
    onRadioCellClick(e) {
        const { item } = e.currentTarget.dataset;
        this.setData({
            memberType: String(item.memberType),
            price: item.price * 100
        });
    },
    onSubmit: Util.throttle(function() {
        Vant.Toast.loading({
            mask: true,
            message: ''
        });
        UniApi.cloud('createOrder', {
            memberType: String(this.data.memberType),
            memberDay: this.data.memberDay,
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
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return Store.defaultShareInfo;
    }
})