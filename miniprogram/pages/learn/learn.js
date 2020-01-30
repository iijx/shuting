//index.js
const { Util } = getApp()
const maxNumMap = {
    1: 10,
    2: 100,
    3: 1000,
    4: 10000,
    5: 100000,
    6: 1000000,
    7: 10000000,
    8: 100000000,
    9: 1000000000,
    10: 10000000000,
    11: 100000000000,
}
let AudioContext = null;
Page({
    data: {
        maxDigitNum: 3, // 最多位数，例如2，表最多2位数，即最大值99
        type: 'number', // number || year || time || phone

        answer: 0,
        answerLength: 0,
        inputValue: '',
        spanClass: '',

        allNums: [],
        focus: false,
    },

    onLoad: function (opt = {}) {
        const { maxDigitNum = 4, type = 'number', } = opt;
        this.setData({
            maxDigitNum,
            type
        });
        this.init();
    },
    init() {
        this.data.allNums = Util.allNums.filter(num => num < maxNumMap[this.data.maxDigitNum]).sort(() => Math.random() - 0.5);
        console.log(this.data.allNums);
        AudioContext = wx.createInnerAudioContext()
        this.next()
    },
    audioPlay() {
        AudioContext.src = `http://cdnword.iijx.site/assets/audio/numberAudio/${this.data.answer}.mp3`;
        AudioContext.play();
        this.setData({
            focus: true,
        })
    },
   
    _preStartInit() {
        this.setData({
            inputValue: '',
            spanClass: ''
        })
    },
    _genAnswerByType() {
        if(this.data.type === 'number') {
            this.data.answer = this.data.allNums.pop();
            this.audioPlay();
        }
        this.setData({
            answerLength: (this.data.answer + '').length
        })
    },
    showAnswer(autoNextIfCorrect = true) {
        if (this.data.inputValue+'' === this.data.answer+'' ) {
            AudioContext.src = 'http://cdnword.iijx.site/assets/audio/commonAudio/rosetta_right.m4a';
            this.setData({
                spanClass: 'correct'
            })
            if (autoNextIfCorrect) {
                Util.sleep(2000).then(() => this.next())
            }
        } else {
            AudioContext.src = 'http://cdnword.iijx.site/assets/audio/commonAudio/rosetta_error.m4a';
            this.setData({
                spanClass: 'error'
            })
            Util.sleep(1500).then(() => this.audioPlay())
        }
        AudioContext.play();
    },
    next() {
        this._preStartInit();
        this._genAnswerByType()
    },
    focusBox() {
        this.setData({
            isFocus: true
        })
    },
    input(e) {
        const value = e.detail.value.length > this.data.answerLength ? this.data.inputValue : e.detail.value;

        if(value + '' === this.data.inputValue + '') return;
        else {
            this.setData({
                spanClass: '',
                inputValue: value
            })
            if(e.detail.value.length >= this.data.answerLength) {
                this.showAnswer();
            }
        }
    },
    submitCode(e) {
        if (e.detail.value.code.length < this.data.codeLength) {
            wx.showToast({
                title: '验证码没有填全哦~',
                icon: "none",
                duration: 1500
            })
        } else {
            wx.showToast({
                title: '登录成功',
                duration: 1500
            })
        }
        console.log(e.detail.value.code.length);
    },

})