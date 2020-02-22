//index.js
const app = getApp();
const { Util, Config, XData } = app;
import { LevelList, SubLevelList } from '../../lib/level.js';
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
        maxLength: 3, // 最多位数，例如2，表最多2位数，即最大值99
        type: 'number', // number || year || time || phone
        curSubLevel: -1,
        score: 0,

        answer: 0,
        answerLength: 0,
        inputValue: '',
        spanClass: '',

        allNums: [],

        nums: [1, 2, 3, 4,5 ,6 ,7 ,8, 9, '.', 0, 'x']
    },
    // 
    onLoad: function (opt = {}) {
        console.log("learn page 正在学习", opt);
        if(!opt.subLevel) {
            wx.showToast({
                title: '无课程级别',
                icon: 'warn',
                duration: 2000
            })
            return;
        }

        let curSubLevel = SubLevelList.find(item => item.level === parseInt(opt.subLevel)) || {};
        const { maxLength = 4, type = 'number', level } = curSubLevel;

        this.setData({
            curSubLevel: level,
            maxLength,
            type,
            score: XData.subLevelLearnedMap[level] || 0
        });
        this.init();
    },
    init() {
        this.data.allNums = Util.allNums.filter(num => num < maxNumMap[this.data.maxLength]).sort(() => Math.random() - 0.5);
        AudioContext = wx.createInnerAudioContext()
        this.nextWord()
    },
    _genAudioSrcByNumAndType(num, type) {
        let dir = '';
        if (type === 'number') dir = 'numberAudio';
        else if (type === 'phone') dir = 'phoneAudio';
        return `${Config.cdnDomain}/assets/audio/${dir}/${this.data.answer}.mp3`;
    },
    audioPlay() {
        AudioContext.src = this._genAudioSrcByNumAndType(this.data.answer, this.data.type);
        AudioContext.play();
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
        } else if (this.data.type === 'phone'){
            this.data.answer = this.data.allPhones.pop();
        }

        this.audioPlay();
        this.setData({
            answerLength: (this.data.answer + '').length
        })
    },
    showAnswer(autoNextIfCorrect = true) {
        if (this.data.inputValue+'' === this.data.answer+'' ) {
            this.data.score += Config.correctScore;
            XData.setSingleSubLevelLearned(this.data.curSubLevel, this.data.score);
            AudioContext.src = Config.correctAudioSrc;
            this.setData({
                score: this.data.score,
                spanClass: 'correct'
            })
            if (autoNextIfCorrect) {
                Util.sleep(2000).then(() => this.nextWord())
            }
        } else {
            AudioContext.src = errorAudioSrc;
            this.data.score += Config.errorScore;
            if (this.data.score < 0) this.data.score = 0; 

            XData.setSingleSubLevelLearned(this.data.curSubLevel, this.data.score);
            this.setData({
                score: this.data.score,
                spanClass: 'error'
            })
            Util.sleep(1500).then(() => this.audioPlay())
        }
        AudioContext.play();
    },
    nextWord() {
        if (this.data.score >= 100) {
            wx.redirectTo({
                url: '../summary/summary',
            })
        } else {
            this._preStartInit();
            this._genAnswerByType()
        }
    },
    promptBtn() {
        if(this.data.inputValue.length >= this.data.answerLength) return;

        let errorIndex = -1;
        let answerStr = this.data.answer + '';
        for(let i = 0; i < this.data.answerLength; i++) {
            if(this.data.inputValue[i] !== answerStr[i]) {
                errorIndex = i;
                break;
            }
        }
        let newInputValue = answerStr.slice(0, errorIndex + 1);
        this.setData({
            inputValue: newInputValue
        })

        if(newInputValue.length >= this.data.answerLength) this.showAnswer();
    },
    keyTap(e) {
        const key = e.target.dataset.value;
        const newValue = key === 'x' ? this.data.inputValue.slice(0, -1) : this.data.inputValue + key;

        if (newValue.length > this.data.answerLength) return;
        else {
            this.setData({
                spanClass: '',
                inputValue: newValue
            })

            if (newValue.length >= this.data.answerLength) {
                this.showAnswer();
            }
        }
    }

})