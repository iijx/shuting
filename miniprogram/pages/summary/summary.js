// pages/summary/summary.js
const app = getApp();
const { Util, UniApi, Vant } = app;

let AudioContext = null;

app.createPage({
    data: {
        user: new app.Models.User({}),
        rawLesson: [],
        curLearnLevel: {},
        curLearnUnit: {},
        env: {},
        config: {}
    },
    onLoad: function (opt) {
        AudioContext = wx.createInnerAudioContext();
        app.Store.update();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        Util.sleep(200).then(() => {
            AudioContext.src = '/assets/audio/win.m4a';
            AudioContext.play();
        })
    },
    showNoAuthDialog() {
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
                confirmButtonColor: '#d93043',
            })
        }
    },
    toLearnCurSubLevel() {
        wx.redirectTo({
            url: '../learn/learn',
        })
    },
    toLearnNextSubLevel() {
        let unitList = this.data.rawLesson.find(i => i.levelId === this.data.curLearnLevel.levelId).unitList;
        let targetUnit = unitList.find(i => i.rank === this.data.curLearnUnit.rank + 1);
        if (!targetUnit) {
            let nextLevel = this.data.rawLesson.find(i => i.rank === this.data.curLearnLevel.rank + 1);
            if (nextLevel) {
                targetUnit = nextLevel.unitList[0];
            } else {
                // 连下一个level级别都找不到，说明全部学习完了
                Vant.Dialog.alert({
                    title: '提示',
                    message: '您已经全部学习完成啦',
                    confirmButtonText: '知道了',
                    confirmButtonColor: '#d93043',
                })
                return;
            }
        }
        // 判断权限
        if (!this.data.user.isPro && targetUnit.isPro) {
            // 说明无权限学习
            this.showNoAuthDialog();
        } else {
            app.Store.setCurLearn(targetUnit.unitId);
            wx.redirectTo({
                url: '../learn/learn',
            })
        }
    },
    lookAllBtn() {
        wx.navigateBack({
            delta: 1,
            fail: (err) => {
                wx.redirectTo({
                    url: '../level/level'
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})