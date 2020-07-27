const app = getApp();
const { Util, Vant, Store } = app;

app.createPage({
    data: {
        user: new app.Models.User({}),
        lesson: [],
        curLearnLevel: {},
        curLearnUnit: {},
        isShowNote: false,
        noteType: '',
        monthWords: [...Util.MonthWords],
        weekWords: [...Util.WeekWords],
        config: {},
        env: {},
        isShowRecordDetail: false
    },
    onLoad: function (options) {
        
    },
    onShow: function () {
        this.update();
    },
    switchShowRecordDetail() {
        this.setData({
            isShowRecordDetail: !this.data.isShowRecordDetail
        })
    },
    selectBtn: function(e) {
        let unit = e.currentTarget.dataset.level;
        // 1. 会员拦截
        if (unit.isPro && !this.data.user.isPro) {
            if (this.data.env.platform === 'android') {
                Vant.Dialog.confirm({
                    title: '开通会员',
                    message: '会员专享内容，请先开通会员',
                    cancelButtonText: '知道了',
                    confirmButtonText: '去看看',
                    confirmButtonColor: '#4b51f2',
                }).then(res => {
                    wx.navigateTo({ url: '../buy/buy' })
                }).catch(err => {
                    
                })
            } else {
                Vant.Dialog.alert({
                    title: '开通会员',
                    message: this.data.config.iosBuyPrompt,
                    confirmButtonText: '知道了',
                    confirmButtonColor: '#4b51f2',
                })
            }
            return;
        }
        Store.setCurLearn(unit.unitId);
        // 2. 进入学习
        wx.nextTick(() => {
            wx.navigateTo({
                url: '../learn/learn',
            })
        })
        
    },
    memberBtn() {
        if (this.data.env.platform === 'android') {
            wx.navigateTo({
                url: '../buy/buy',
            })
        } else {
            console.log(this.data.config)
            Vant.Dialog.alert({
                title: '开通会员',
                message: this.data.config.iosBuyPrompt,
                confirmButtonText: '知道了',
                confirmButtonColor: '#4b51f2',
            }).then(() => {
                // on close
            });
        }
    },
    wordPlay(e) {
        let src = e.currentTarget.dataset.audio;
        app.AppAudio.src = src;
        app.AppAudio.play();
    },
    
    startHardMode() {
        if (!this.data.user.isPro) {
            Vant.Dialog.alert({
                message: '会员专享内容，请先开通会员',
                confirmButtonText: '知道了',
                confirmButtonColor: '#4b51f2',
            })
            return;
        } else {
            wx.navigateTo({
                url: '../learn/learn?mode=hard',
            })
        }
    },
    noteBtn(e) {
        let unit = e.currentTarget.dataset.unit;
        this.setData({
            noteType: unit.type,
            isShowNote: true,
        })
    },
    audioNote(e) {
        let index = Number(e.currentTarget.dataset.index);
        if (index !== 0 && index !== 1) return;

        Vant.Dialog.alert({
            title: index === 0 ? '数字系列读音示例' : '电话系列读音示例',    
            message: index === 0 ? '110 => one hundred and ten' : '10086 => one zero zero eight six',
            confirmButtonText: '知道了',
            confirmButtonColor: '#4b51f2',
        })
    },
    popOnClose() {
        this.setData({
            isShowNote: false,
        })
    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {
    },
})
