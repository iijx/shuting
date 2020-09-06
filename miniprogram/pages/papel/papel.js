// pages/papel/papel.js
const app = getApp();
const { Util, Vant, Store, Config } = app;
import papel from '../../local/papel';

app.createPage({
  data: {
    papelArr: [...papel],
    index: 0,
    
    curQuestion: '',
    curOptions: [],
    curOrigin: [],
    curAudioSrc: '',

    curUserAnswer: -1,

    isShowOrigin: false,
    isLoading: false,
    isPlaying: false,

    percent: 0,
    speed: 25
    
  },
  onLoad: function (options) {
    this.initItem()
  },
  initItem() {
    let item = this.data.papelArr[this.data.index];
    this.setData({
      isPlaying: false,
      curUserAnswer: -1,
      curAudioSrc: item.audio,
      curOrigin: [...item.origin],
      curQuestion: item.q,
      curOptions: item.o.map(i => ({
        label: i,
        showResClass: ''
      }))
    })
    this.prePlay()
    
  },
  loadingAnimation() {

  },
  prePlay() {
    this.setData({
      percent: 100
    })
    Promise.all([Util.sleep(4000), app.uniAudio.setSrc(`${Config.cdnDomain}${this.data.curAudioSrc}`)])
      .then(() => {
        console.log(1);
        this.setData({
          isPlaying: true
        })
        app.uniAudio.play(() => {
          this.setData({ isPlaying: false })
        });
      })
      .catch(err => {
        console.log(12)
      })
  },
  audioClick() {
    if (this.isLoading) return;
    
    if (this.data.isPlaying) {
      app.uniAudio.stop();
      this.setData({ isPlaying: false })
    }
    if (this.data.isPlaying) {
      app.uniAudio.play(() => this.setData({ isPlaying: false }));
      this.setData({ isPlaying: true })
    }
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
  nextQ() {
    console.log(1);
    this.data.index++;
    this.initItem()
  },
  prevQ() {
    if (this.data.index > 0) {
      this.data.index--;
      this.initItem()
    }
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