const app = getApp();
const { Util, UniApi, Vant } = app;

app.createPage({
  data: {
    arr: [
      '基数词',
      '序数词',
      '分数',
      '电话',
      '年/月/日',
      '时间',
      '单位',
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
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },
})