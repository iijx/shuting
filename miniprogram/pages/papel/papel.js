// pages/papel/papel.js
const app = getApp();
const { Util, Vant, Store } = app;
import papel from '../../local/papel';

app.createPage({
  data: {
    papelArr: [...papel],
    index: 0,
    
    curQuestion: '',
    curOptions: [],
    curOrigin: [],

    curUserAnswer: -1,

    isShowOrigin: false,
    
  },
  onLoad: function (options) {
    this.initItem()
  },
  initItem() {
    let item = this.data.papelArr[this.data.index];
    this.setData({
      curUserAnswer: -1,
      curOrigin: [...item.origin],
      curQuestion: item.q,
      curOptions: item.o.map(i => ({
        label: i,
        showResClass: ''
      }))
    })
  },

  optionClick(e) {
    if (this.data.curUserAnswer !== -1) return;

    let index = e.currentTarget.dataset.index;
    this.data.curUserAnswer = index;
    console.log(index)
    if (this.data.papelArr[this.data.index].answer === index + 1) {
      this.data.curOptions[index].showResClass = 'right'
    } else this.data.curOptions[index].showResClass = 'error'

    this.setData({
      curOptions: this.data.curOptions
    })
    console.log(this.data.curOptions[index])

    setTimeout(() => {
      this.data.index++;
      this.initItem()
    }, 1500)

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  toggleOrigin() {
    this.setData({
      isShowOrigin: !this.data.isShowOrigin
    })
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