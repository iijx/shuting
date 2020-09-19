const app = getApp();
const { Util, Vant, Store } = app;
app.createPage({
  data: {
      user: new app.Models.User({}),
      curLearnLevel: {},
      curLearnUnit: {},

      curWeek: [],
      curMonth: {
        label: '',
        index: 6,
        year: 2020
      },
      labelWeek: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],

      showShare: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const monthsLabel = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = (new Date()).getMonth();
    this.setData({
      curWeek: Util.getWeekByDate(new Date()).map(i => ({
        num: String(i.getDate()).padStart(2, '0'),
        isToday: Util.isToday(i)
      })),
      curMonth: {
        label: monthsLabel[monthIndex],
        index: monthIndex,
        year: new Date().getFullYear()
      }
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

  toArticle() {
    wx.navigateTo({
      url: '../article/article',
    })
  },
  toLevel() {
    wx.navigateTo({
      url: '../level/level',
    })
  },
  toQst() {
    wx.navigateTo({
      url: '../qst/qst',
    })
  },
  toPapel() {
    wx.navigateTo({
      url: '../papel/papel',
    })
  },

  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },
  toMy() {
    wx.switchTab({
      url: '../my/my'
    })
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },
  // 用户点击右上角分享
  onShareAppMessage() {
    return {
      path: `/pages/index/index?fromOpenid=${this.data.user.openid}`,
      title: '刻意练习 · 提升数听力'
  }
},
})