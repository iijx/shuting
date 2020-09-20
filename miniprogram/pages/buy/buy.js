// pages/buy/buy.js
const app = getApp();
const { Util, UniApi, Vant } = app;
app.createPage({
    data: {
        memberType: "3",
        price: 0,
        paying: false,
        signUpNumber: 10,
        env: {},
        config: {},
        goods: [],

        isShowBuyDuju: false,
        curMemberMode: 'normal', // 'normal' || 'duju'

        dujuPriceStr: '0.00',
        normalPriceStr: '18.00',

        showShare: false,

    },
    onLoad: function (options) {
        this.updateSignUpNumber();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let isShowBuyDuju = wx.getStorageSync('l_isShowBuyDuju') || 0;
        console.log('isShowBuyDuju', isShowBuyDuju);
        if (isShowBuyDuju === 0) {
            console.log(Math.random() * 100, this.data.config.androidWithDujuRate)
            isShowBuyDuju = (Math.random() * 100) <= this.data.config.androidWithDujuRate ? 1 : -1;
            console.log((Math.random() * 100) <= this.data.config.androidWithDujuRate)
            wx.setStorage({ key: 'l_isShowBuyDuju', data: String(isShowBuyDuju)});
        }

        wx.nextTick(() => {
            let defaultGood = this.data.goods.find(item => String(item.memberType) === '3');
            this.data.price = defaultGood.price * 100;
            this.setData({
                isShowBuyDuju: String(isShowBuyDuju) === '1',
                memberType: String(defaultGood.memberType),
                normalPriceStr: (defaultGood.price).toFixed(2),
                dujuPriceStr: ((this.data.goods.find(item => String(item.memberType) === '20') || {}).price || 10).toFixed(2)
            })
        })

    },
    handerBack() {
        wx.navigateBack({
            delta: 1
        })
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
                        UniApi.appCloud('order', 'getStatus', { out_trade_no }).then(res => {
                            if (String(res.status) === '2') {
                                Vant.Toast.clear();
                                UniApi.appCloud('user', 'get').then(res => {
                                    app.Store.data.user = res;
                                    that.update();
                                    Vant.Dialog.alert({
                                        title: '恭喜',
                                        message: '开通成功',
                                        confirmButtonColor: '#d93043',
                                    }).then(res => {
                                        wx.switchTab({
                                          url: '../my/my' // 指定页面的url
                                        });
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
                        confirmButtonColor: '#4b51f2',
                    }).then(res => {
                        this.onSubmit();
                    }).catch(err => {
    
                    })
                }
            })
        }
    },
    setNormalMembetMode() { 
        this.data.price = Math.ceil(this.data.normalPriceStr * 100)
        this.setData({ 
            curMemberMode: 'normal',
            memberType: 3
        }) 
    },
    setDujuMembetMode() { 
        this.data.price = Math.ceil(this.data.dujuPriceStr * 100)
        this.setData({
            curMemberMode: 'duju',
            memberType: 20
        }) 
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
        retNum += hour <= 6 ? 8 * hour : 22 + 6 * (hour - 6);
        retNum += this.randomNum(0, 3);
        this.setData({
            signUpNumber: parseInt(Number(retNum))
        })
    },
    randomNum(min, max) {
        return Math.random() * (max - min) + min;
    },
    onRadioCellClick(e) {
        const { item } = e.currentTarget.dataset;
        this.setData({
            memberType: String(item.memberType),
            price: Math.round(item.price * 100)
        });
    },
    onSubmit: Util.throttle(function() {
        Vant.Toast.loading({
            mask: true,
            message: ''
        });
        UniApi.appCloud('order', 'post', {
            memberType: String(this.data.memberType),
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

    detailRule() {
        this.setData({ showShare: true })
    },
    onCloseShare() {
        this.setData({ showShare: false })
    }
})