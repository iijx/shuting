//index.js
const app = getApp();
const { Util, Config, UniApi, Vant, Store, CreateStoreBindings } = app;
let AudioContext = null;

Page({
    data: {
        mode: 'normal',

        maxLength: 3, // 最多位数，例如2，表最多2位数，即最大值99
        type: 'number', // number || year || time || phone
        curSubLevel: -1,
        isComplete: false,
        score: 0,

        answer: 0,
        answerLength: 0,
        inputValue: '',
        spanClass: '',

        nums: [1, 2, 3, 4, 5 ,6 ,7 ,8, 9, '.', 0, 'x'],

        isShowGoodImg: true,
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
            const { mode = 'normal' } = opt;

            let score = 0;
            let subLevelLearned = this.data.subLevelLearnedMap.find(item => item.subLevelId === this.data.curSubLevel.levelId);
            score = subLevelLearned ? subLevelLearned.score : 0;
            this.setData({
                mode,
                maxLength,
                type,
                score: score >= 100 ? 0 : score,
                isComplete: Boolean(subLevelLearned && subLevelLearned.isComplete)
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
        else if (type === 'phone') path = `phoneAudio/${this.data.answer}.m4a`;
        else if(type === 'time') {
            let h = this.data.answer.slice(0, 2);
            let m = this.data.answer.slice(2);
            path = `timeAudio/${h}_${m}.m4a`;
        } else if (type === 'year') {
            path = `yearAudio/${this.data.answer}.mp3`;
        } else if (type === 'pointNum') {
            path = `pointAudio/${this.data.answer}.mp3`;
        } else if (type === 'week') {
            return `/assets/audio/week/week_${this.data.answer}.mp3`;
        }
        else if (type === 'month') {
            return `/assets/audio/month/month_${this.data.answer}.mp3`;
        }

        console.log(`${Config.cdnDomain}/assets/audio/${path}`);
        return `${Config.cdnDomain}/assets/audio/${path}`;
    },
    audioPlay() {
        AudioContext.src = this._genAudioSrcByNumAndType(this.data.type);
        AudioContext.play();
    },
   
    _preStartInit() {
        this.setData({
            inputValue: '',
            spanClass: ''
        })
    },
    _randomOneType() {
        const types = ['number', 'phone', 'number', 'time', 'year', 'number', 'pointNum', 'number', 'number', 'month'];
        const phones = [4, 6, 8];
        
        let type = types[Util.randomIntegerInRange(0, types.length)];
        if (type === 'number') {
            this.setData({
                maxLength: Util.randomIntegerInRange(1, 9)
            })
        } else if (type === 'phone') {
            this.setData({
                maxLength: phones[Util.randomIntegerInRange(0, 3)]
            })
        }
        return type;
        
    },
    _genOneAnswer() {
        let type = this.data.mode === 'hard' ? this._randomOneType() : this.data.type;
        let answer = '';
        if(type === 'number') {
            answer = Util.randomOneNum(this.data.maxLength);
        } else if (type === 'phone'){
            answer = Util.randomOnePhone(this.data.maxLength)();
        } else if (type === 'time') {
            answer = Util.randomOneTime();
        } else if (type === 'year') {
            answer = Util.randomOneYear();
        } else if (type === 'pointNum') {
            answer = Util.randomPointNumber();
        } else if (type === 'week') {
            answer = Util.randomOneWeek();
        } else if (type === 'month') {
            answer = Util.randomOneMonth();
        }
        if (answer === this.data.answer) {
            return this._genOneAnswer();
        } else {
            this.data.answer = answer;
            this.setData({
                type,
                answerLength: String(this.data.answer).length
            });
            this.audioPlay();
        };

    },
    _isCorrect() {
        return String(this.data.inputValue) === String(this.data.answer);
    },
    playResultAudio(isCorrect) {
        return new Promise((resolve, reject) => {
            AudioContext.src = isCorrect ? Config.correctAudioSrc : Config.errorAudioSrc;
            AudioContext.play();
            Util.sleep(700).then(() => resolve());
        })
    },
    showAnswer() {
        let isCorrect = this._isCorrect();
        if (this.data.mode === 'normal') {
            // 分数统计，与本地存储
            if (isCorrect) {
                if ((this.data.type === 'number' && this.data.maxLength === 1) || this.data.type === 'week') {
                    this.data.score += Config.correctScorePlus;
                } else {
                    this.data.score += Config.correctScore;
                }
                this.setSingleSubLevelLearned(this.data.curSubLevelId, this.data.score);
            } else {
                this.data.score += Config.errorScore;
                if (this.data.score < 0) this.data.score = 0; 
                this.setSingleSubLevelLearned(this.data.curSubLevelId, this.data.score);
            }
            this.setData({
                score: this.data.score,
            })
        }
        this.setData({
            spanClass: isCorrect ? 'correct' : 'error'
        })

        // 播放声音，及下一个词
        this.playResultAudio(isCorrect).then(() => {
            isCorrect ? this.nextWord() : this.audioPlay(); 
        });
    },
    nextWord() {
        if (this.data.score >= 100 && this.data.mode !== 'hard') {
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
        return this.data.defaultShareInfo;
    },

})