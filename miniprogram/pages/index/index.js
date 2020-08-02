const app = getApp();
const { Util, Vant, Store } = app;
app.createPage({
  data: {
      user: new app.Models.User({}),
      curLearnLevel: {},
      curLearnUnit: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // wx.switchTab({
    //   url: '../level/level'
    // })
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
})