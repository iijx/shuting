//index.js
const { Util } = getApp()
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

        answer: 0,
        answerLength: 0,
        inputValue: '',
        spanClass: '',

        allNums: [],

        nums: [1, 2, 3, 4,5 ,6 ,7 ,8, 9, '.', 0, 'x']
    },

    onLoad: function (opt = {}) {
        console.log('learn options', opt);
        let curSubLevel = SubLevelList.find(item => item.level === parseInt(opt.subLevel)) ;
        console.log(curSubLevel);

        const { maxLength = 4, type = 'number', } = curSubLevel;
        this.setData({
            maxLength,
            type
        });
        this.init();
    },
    init() {
        this.data.allNums = Util.allNums.filter(num => num < maxNumMap[this.data.maxLength]).sort(() => Math.random() - 0.5);
        AudioContext = wx.createInnerAudioContext()
        this.next()
    },
    audioPlay() {
        AudioContext.src = `http://cdnword.iijx.site/assets/audio/numberAudio/${this.data.answer}.mp3`;
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