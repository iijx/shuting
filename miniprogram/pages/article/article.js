const app = getApp();
const { Util, UniApi, Vant } = app;

app.createPage({
  data: {
    arr: [
      '基数词',
      '序数词',
      '分数小数',
      '电话',
      '年/月/日',
      '时间',
      '各种单位',
    ],
    activeKey: 0,
    monthWords: [...Util.MonthWords].map(i => `${i.word}  /${i.phonetic}/  ${i.mean}`),
    weekWords: [...Util.WeekWords].map(i => `${i.word}  /${i.phonetic}/  ${i.mean}`),
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
  onChange(e) {
    // this.setData({
    //   activeKey: e.detail
    // });
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