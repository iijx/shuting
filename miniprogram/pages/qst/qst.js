const app = getApp();
const { Util, Vant, Store, Config } = app;
let AudioContext = null;

app.createPage({
  data: {
    user: new app.Models.User({}),
     arr: [],
     isPlaying: false,
     playCount: 1,
     isHiding: false,
     speed: '1.0',
     isShowDialog: false,
     curTypes: [],

     playingId: '',
     checkboxArr: ['number', 'pointNum'],
     numCountArr: [
      { label: '2位', len: 2, key: 2, checked: true },
      { label: '3位', len: 3, key: 3, checked: true },
      { label: '4位', len: 4, key: 4, checked: false },
      { label: '5位', len: 5, key: 5, checked: false },
      { label: '6位', len: 6, key: 6, checked: false }
    ],
     phoneCountArr: [
      { label: '4位', len: 4, key: 2, checked: false },
      { label: '6位', len: 6, key: 3, checked: false },
      { label: '8位', len: 8, key: 4, checked: false },
    ],

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    AudioContext = wx.createInnerAudioContext();
    this.gen();
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
  _genAudioSrcItem(item) {
    let type = item.type;
    let answer = item.word;
    let path = '';
    if (type === 'number') path = `numberAudio/${answer}.mp3`;
    else if (type === 'phone') path = `shuting/${Math.random() > 0.5 ? 'soundtype1' : 'soundtype2'}/phone${String(answer).length}/${answer}.mp3`;
    else if(type === 'time') {
      path = `shuting/${Math.random() > 0.5 ? 'soundtype1' : 'soundtype2'}/time/${answer.replace(':', '.')}.mp3`;
    } else if (type === 'year') {
        path = `yearAudio/${answer}.mp3`;
    } else if (type === 'pointNum') {
        // path = `pointAudio/${answer}.mp3`;
        path = `shuting/${Math.random() > 0.5 ? 'soundtype1' : 'soundtype2'}/point/${answer}.mp3`;
    } else if (type === 'week') {
        return `/assets/audio/week/week_${answer}.mp3`;
    }
    else if (type === 'month') {
        return `/assets/audio/month/month_${answer}.mp3`;
    }
    console.log(`${Config.cdnDomain}/assets/audio/${path}`);
    return `${Config.cdnDomain}/assets/audio/${path}`;
  },
  _playPromise() {
    AudioContext.play();
    return new Promise((resolve, reject) => {
      AudioContext.onEnded(() => {
        resolve()
      })
    })
  },
  play(){
    let that = this;
    let index = -1;
    (function autoPlay() {
      if (that.data.isPlaying) {
        if(index >= that.data.arr.length) {
          if (that.data.playCount === 1) {
            index = -1;
          } else return;
        }
        AudioContext.src = index === -1 ? `${Config.cdnDomain}/assets/audio/commonAudio/ding.mp3` : that._genAudioSrcItem(that.data.arr[index])
        AudioContext.play();
        index += 1;
        that._playPromise().then(() => {
          let playid = that.data.playingId;
            setTimeout(() => {
              if (playid === that.data.playingId) {
                autoPlay();
              }
            }, 1300)
        });
      }
    })();
  },
  switchPlay() {
    if (this.data.checkboxArr.length <= 0) {
      Vant.Toast.fail('暂无播放内容');
      return;
    };
    this.data.isPlaying = !this.data.isPlaying;
    this.setData({
      isPlaying: this.data.isPlaying
    })
    if (this.data.isPlaying) {
      this.data.playingId = String(Math.random());
      this.play();
    } else {
      // AudioContext.pause();
    }
  },
  numRadioBtnClick(e) {
    const index = e.detail.index;
    if(index >= 2 && !this.data.user.isPro) return;

    let temp = {...this.data.numCountArr[index]};
    temp.checked = !temp.checked;
    this.data.numCountArr.splice(index, 1, temp)
    this.setData({
      numCountArr: this.data.numCountArr
    })
  },
  phoneRadioBtnClick(e) {
    if(!this.data.user.isPro) return;

    const index = e.detail.index;
    let temp = {...this.data.phoneCountArr[index]};
    temp.checked = !temp.checked;
    this.data.phoneCountArr.splice(index, 1, temp)
    this.setData({
      phoneCountArr: this.data.phoneCountArr
    })
  },

  switchHide() {
    this.setData({
      isHiding: !this.data.isHiding
    })
  },
  switchSpeed() {

  },
  changeTypes() {
    this.setData({
      isShowDialog: true
    })
  },
  dialogConfirm() {
    this.gen();
  },
  _genOneAnswer(type) {
    let answer = '';
    let len = 4;
    if(type === 'number') {
      len = this.data.numCountArr.filter(i => i.checked).map(i => i.len).sort((a, b) => Math.random() - 0.5)[0];
        answer = Util.randomOneNum(len);
    } else if (type === 'phone'){
        len = this.data.phoneCountArr.filter(i => i.checked).map(i => i.len).sort((a, b) => Math.random() - 0.5)[0];
        answer = Util.randomOnePhone(len)();
    } else if (type === 'time') {
        answer = Util.randomOneTime();
        console.log('time answer', answer)
        answer = answer.replace('.', ':');
    } else if (type === 'year') {
        answer = Util.randomOneYear();
    } else if (type === 'pointNum') {
        answer = Util.randomPointNumber();
    } else if (type === 'week') {
        answer = Util.randomOneWeek();
    } else if (type === 'month') {
        answer = Util.randomOneMonth();
    }
    return answer;
  },
  
  gen() {
    if (this.data.checkboxArr.length <= 0) {
      Vant.Toast.fail('请先设置内容');
      return;
    };

    this.data.isPlaying = false;
    this.setData({
      isPlaying: this.data.isPlaying
    })


    let allTypes = [...this.data.checkboxArr];
    if (allTypes.includes('number')) {
      let count = this.data.numCountArr.filter(i => i.checked).length;
      if (count === 0) {
        allTypes = allTypes.filter(i => i !== 'number')
      } else {
        for(let i = 1; i < count; i++) {
          allTypes.push('number')
        }
      }
    }
    if (allTypes.includes('phone')) {
      let count = this.data.phoneCountArr.filter(i => i.checked).length;
      if (count === 0) {
        allTypes = allTypes.filter(i => i !== 'phone')
      } else {
        for(let i = 1; i < count; i++) {
          allTypes.push('phone')
        }
      }
    }

    allTypes.sort((a, b) => Math.random() - 0.5);

    let arr = allTypes.map(i => {
      return {
        type: i,
        word: this._genOneAnswer(i)
      }
    });

    for(let i = arr.length; i < 10; i++ ) {
      let type = allTypes[Math.floor(Math.random() * allTypes.length + 1)-1];
      arr.push({ type, word: this._genOneAnswer(type)})
    }

    this.setData({ arr })
  },
  onChange(event) {

    // let arr = event.detail;
    // if (!this.data.user.isPro) {
    //   if (arr.includes('phone') || arr.includes('year') || arr.includes('time')) {
    //     // Vant.Toast('该选项需开通会员');
    //     Vant.Notify('通知内容');
    //     return;
    //   }
    // }
    this.setData({
      checkboxArr: event.detail
    });
  },

  switchPlayCount() {
    if (this.data.playCount === 1) {
      this.setData({
        playCount: ''
      });
      Vant.Toast.success('取消循环播放');
    } else {
      this.setData({
        playCount: 1
      })
      Vant.Toast.success('开启循环播放');
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    this.data.isPlaying = false;
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    this.data.isPlaying = false;
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})