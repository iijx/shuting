// pages/buy/buy.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radio: "1",
        price: 290,
        paying: false,
        dujuImage: [],
        signUpNumber: 10
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.updateSignUpNumber();
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
    randomNum(min, max) {
        return Math.random() * (max - min) + min;
    },
    onRadioChange(e) {
        console.log(e);
        this.setData({
            radio: e.detail,
            price: String(e.detail === '1') ? 290 : 480
        });
    },
    onRadioCellClick(e) {
        const { name } = e.currentTarget.dataset;
        console.log(name);
        this.setData({
            radio: name,
            price: String(name) === '1' ? 290 : 480
        });
    },
    onSubmit() {
        UniApi.cloud('getWxPayInfo', {
            memberType: this.data.radio + ''
        }).then(res => {
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
                fail: () => {
                  // 小程序跳转失败
                  // 做好错误处理
                }
              })
        })
    },

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

    }
})