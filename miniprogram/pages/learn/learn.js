//index.js
const app = getApp();
const { Util, Config, UniApi, Vant, Store } = app;
let AudioContext = null;

app.createPage({
    data: {
        mode: 'normal',
        maxLength: 3, // 最多位数，例如2，表最多2位数，即最大值99
        type: 'number', // number || year || time || phone
        curLearnUnit: {},
        allAnswerRecord: [], // 这一次的全部答案记录
        answerRecord: ['', '', '', '', ''], // 当前一组词的答案记录
        answer: 0,
        answerLength: 0,
        inputValue: '',
        spanClass: '',

        nums: [1, 2, 3, 4, 5 ,6 ,7 ,8, 9, '.', 0, 'x'],

        isFirstAnswer: true,
        isShowCorrectAnswer: false,

        isShowFeedBack: false, // 反馈
        feedBackOptions: [
            { name: '发音不全/不清晰' },
            { name: '没有声音' },
            { name: '其他' }
        ],
        env: {}
    },
    onLoad: function (opt = {}) {
        Util.sleep(30).then(() => {
            const { length = 2, type = 'number' } = this.data.curLearnUnit;
            const { mode = 'normal' } = opt;
            this.setData({
                mode,
                maxLength: length || 2,
                type,
            });
            this.init();
        })
    },
    init() {
        AudioContext = wx.createInnerAudioContext();
        this.nextWord();
    },
    _genAudioSrcByNumAndType(answer, type) {
        let path = '';
        if (type === 'number') path = `numberAudio/${answer}.mp3`;
        else if (type === 'phone') path = `shuting/${Math.random() > 0.5 ? 'soundtype1' : 'soundtype2'}/phone${this.data.maxLength}/${answer}.mp3`;
        else if(type === 'time') {
            // let h = answer.split('.')[0];
            // let m = answer.split('.')[1];
            path = `shuting/${Math.random() > 0.5 ? 'soundtype1' : 'soundtype2'}/time/${answer}.mp3`;
        } else if (type === 'year') {
            path = `yearAudio/${this.data.answer}.mp3`;
        } else if (type === 'pointNum') {
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
    audioPlay() {
        AudioContext.play();
    },
    _preStartInit() {
        this.setData({
            inputValue: '',
            spanClass: '',
            isShowCorrectAnswer: false,
            isFirstAnswer: true,
            answerRecord: this.data.answerRecord
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
            console.log('answer', answer);
            AudioContext.src = this._genAudioSrcByNumAndType(answer, this.data.type);
            this.data.answer = type === 'time' ? answer.replace('.', ':') : answer;
            this.setData({
                type,
                answerLength: String(this.data.answer).length,
                answer: this.data.answer,
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
        wx.vibrateShort();
        Util.sleep(100).then(() => wx.vibrateShort());
        Util.sleep(200).then(() => wx.vibrateShort());

        // 1. 处理答题记录
        if (this.data.isFirstAnswer) {
            let index = this.data.answerRecord.findIndex(i => i === '');
            let answer = isCorrect ? 'right' : 'error';
            index >= 0 ? this.data.answerRecord.splice(index, 1, answer) : this.data.answerRecord = [answer, '', '', '', '']
            this.data.allAnswerRecord.push(answer);
            this.setData({
                answerRecord: this.data.answerRecord,
                isFirstAnswer: false
            })
            if (this.data.mode === 'normal') {
                Store.setUnitLearnData(this.data.curLearnUnit.unitId, {
                    cNum: this.data.allAnswerRecord.filter(i => i === 'right').length,
                    eNum: this.data.allAnswerRecord.filter(i => i === 'error').length,
                })
            }
        }
        // 2. 设置正确与错误的样式
        this.setData({
            spanClass: isCorrect ? 'correct' : 'error',
        })
        // 3. 播放「正确与错误」音效，
        this.playResultAudio(isCorrect).then(() => {
            // 3.1 正确 则下一个词
            isCorrect ? this.nextWord() : this.audioPlay(); 
        });
    },
    nextWord() {
        // 1. 如果当前一组的答案记录全部记录满了，则清空该组，准备开启下一组
        if (this.data.answerRecord.findIndex(i => i === '') === -1) {
            // this.data.allAnswerRecord = this.data.allAnswerRecord.concat([...this.data.answerRecord]);
            this.data.answerRecord = ['', '', '', '', ''];
        }
        // 2. 判断全部记录，是否已经有15个，有则完成学习
        if ((this.data.allAnswerRecord.length) >= 15 && this.data.mode === 'normal') {
            this.toSummary()
        } else { // 3. 否则，继续学习
            this._preStartInit();
            this._genOneAnswer()
        }
    },
    toSummary() {
        wx.redirectTo({
            url: '../summary/summary',
        })
    },
    nextWordBtn() {
        if (this.data.spanClass === 'error') {
            this.nextWord();
        }
    },
    promptBtn() {
        // 1. 如果答完了
        if(this.data.inputValue.length >= this.data.answerLength) {
            if ( this.data.spanClass === 'error' && !this.data.isShowCorrectAnswer) {
                this.audioPlay()
                this.setData({ isShowCorrectAnswer: true })
            } 
            return;
        } else { // 2. 没有答完，则逐步显示答案
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
        }
    },
    keyTap(e) {
        if (this.data.spanClass === 'right') return;
        const key = e.target.dataset.value;
        const newValue = key === 'x' ? this.data.inputValue.slice(0, -1) : this.data.spanClass === 'error' ? key : this.data.inputValue + key;

        this.setData({
            spanClass: '',
            inputValue: newValue
        })

        if (newValue.length >= this.data.answerLength) {
            this.showAnswer();
        }
    },
    handerBack() {
        wx.navigateBack({
            delta: 1,
            fail: (err) => {
                wx.redirectTo({
                    url: '../level/level'
                })
            }
        })
    },
    switchfeedback() {
        this.setData({
            isShowFeedBack: !this.data.isShowFeedBack
        })
    },
    onSelectFeedback(e) {
        app.DB.collection('word_error').add({
            data: {
                word: this.data.answer,
                name: e.detail.name
            }
        })
        if (e.detail.name === '没有声音' && this.data.env.platform === 'ios') {
            Vant.Toast.success('是否打开静音模式');
        } else {
            Vant.Toast.success('感谢您的反馈');
        }
    },

    onUnload: function () {
    },
})