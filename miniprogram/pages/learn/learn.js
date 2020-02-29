//index.js
const app = getApp();
const { Util, Config, UniApi, Vant, Store, CreateStoreBindings } = app;
let AudioContext = null;

Page({
    data: {
        maxLength: 3, // 最多位数，例如2，表最多2位数，即最大值99
        type: 'number', // number || year || time || phone
        curSubLevel: -1,
        isComplete: false,
        score: 0,

        answer: 0,
        answerLength: 0,
        inputValue: '',
        spanClass: '',

        nums: [1, 2, 3, 4,5 ,6 ,7 ,8, 9, '.', 0, 'x']
    },
    // 
    onLoad: function (opt = {}) {
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['defaultShareInfo', 'user', 'curLevel', 'curSubLevelId', 'curSubLevel', 'curSubLevelList', 'subLevelLearnedMap'],
            actions: ['setSingleSubLevelLearned']
        });

        Util.sleep(100).then(() => {
            const { maxLength = 4, type = 'number', level } = this.data.curSubLevel;

            let score = 0;
            let subLevelLearned = this.data.subLevelLearnedMap.find(item => item.subLevelId === this.data.curSubLevel.levelId);
            score = subLevelLearned ? subLevelLearned.score : 0;
            this.setData({
                maxLength,
                type,
                score: score >= 100 ? 0 : score,
                isComplete: subLevelLearned && subLevelLearned.isComplete
            });
            this.init();
        })

    },
    init() {
        // 准备数据
        AudioContext = wx.createInnerAudioContext()
        this.nextWord()
    },
    _genAudioSrcByNumAndType(type) {
        let path = '';
        if (type === 'number') path = `numberAudio/${this.data.answer}.mp3`;
        else if (type === 'phone') path = `phoneAudio/${this.data.answer}.${this.data.maxLength === 8 ? 'm4a' : 'mp3'}`;
        else if(type === 'time') {
            let h = this.data.answer.slice(0, 2);
            let m = this.data.answer.slice(2);
            path = `timeAudio/${h}_${m}.m4a`;
        }
        return `${Config.cdnDomain}/assets/audio/${path}`;
    },
    audioPlay() {
        console.log(this._genAudioSrcByNumAndType(this.data.type));
        AudioContext.src = this._genAudioSrcByNumAndType(this.data.type);
        AudioContext.play();
    },
   
    _preStartInit() {
        this.setData({
            inputValue: '',
            spanClass: ''
        })
    },
    _genOneAnswer() {
        if(this.data.type === 'number') {
            this.data.answer = Util.randomOneNum(this.data.maxLength);
        } else if (this.data.type === 'phone'){
            this.data.answer = Util.randomOnePhone(this.data.maxLength)();
        } else if (this.data.type === 'time') {
            this.data.answer = Util.randomOneTime();
        }

        this.audioPlay();
        this.setData({
            answerLength: String(this.data.answer).length
        })
    },
    _isCorrect() {
        // if (this.data.type === 'time') {
        //     return String(this.data.inputValue) === String(this.data.answer).replace('_', '');
        // } else 
        return String(this.data.inputValue) === String(this.data.answer);
    },
    showAnswer(autoNextIfCorrect = true) {
        if (this._isCorrect()) {
            this.data.score += Config.correctScore;
            this.setSingleSubLevelLearned(this.data.curSubLevelId, this.data.score);
            AudioContext.src = Config.correctAudioSrc;
            this.setData({
                score: this.data.score,
                spanClass: 'correct'
            })
            if (autoNextIfCorrect) {
                Util.sleep(2000).then(() => this.nextWord())
            }
        } else {
            AudioContext.src = Config.errorAudioSrc;
            this.data.score += Config.errorScore;
            if (this.data.score < 0) this.data.score = 0; 
            this.setSingleSubLevelLearned(this.data.curSubLevelId, this.data.score);
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
            this._genOneAnswer()
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
    },

    onUnload: function () {
        this.storeBindings.destroyStoreBindings()
    },
    onShareAppMessage: function (res) {
        return this.defaultShareInfo;
    },

})