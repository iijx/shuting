// pages/level/level.js

const app = getApp();
const { Util, XData, Vant, Store, CreateStoreBindings } = app;
import { LevelList, SubLevelList } from '../../lib/level.js';

Page({

    /**
     * Page initial data
     */
    data: {
        levelList: [],

        isShowNote: false,
        noteType: '',

        monthWords: [...Util.MonthWords],
        weekWords: [...Util.WeekWords],

        price: 4.9,
        
        ...XData.create(['memberBanner']),
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        
        
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['user', 'curLevel', 'curSubLevel', 'subLevelLearnedMap', 'systemInfo_platform'],
            actions: ['setCurSubLevelId']
        })
        wx.nextTick(() => {
            let levelList = LevelList.map(item => {
                let unitList = SubLevelList.filter(unit => unit.pLevelId === item.levelId).sort((a, b) => a.index - b.index).map(item => {
                    let subLevel = this.data.subLevelLearnedMap.find(subLevel => subLevel.subLevelId === item.levelId);
                    let score = subLevel ? subLevel.score : 0; 
                    return {
                        ...item,
                        score,
                        isComplete: score >= 100
                    }
                });
                return {
                    ...item,
                    score: unitList.reduce((ac, cur) => ac + cur.score, 0),
                    unitList,
                }
            });
            this.setData({
                levelList,
                price: XData.create(['goods']).goods.find(item => String(item.memberType) === '1').price,
            })
        })
        
       
    },
    onShow: function () {
        this.setData(XData.create(['memberBanner']));
    },
    selectBtn: function(e) {
        let subLevel = e.currentTarget.dataset.level;
        if (subLevel.isPro && !this.data.user.isPro) {
            console.log(this.data.systemInfo_platform)
            if (this.data.systemInfo_platform === 'android') {
                Vant.Dialog.confirm({
                    message: '会员专享内容，请先开通会员',
                    cancelButtonText: '知道了',
                    confirmButtonText: '去看看'
                }).then(res => {
                    wx.navigateTo({ url: '../buy/buy' })
                }).catch(err => {
                    
                })
            } else {
                Vant.Dialog.alert({
                    message: this.data.memberBanner.dialogPrompt,
                    confirmButtonText: '知道了'
                })
            }
            return;
        }
        this.setCurSubLevelId(subLevel.levelId);
        wx.nextTick(() => {
            wx.redirectTo({
                url: '../learn/learn',
            })
        })
        
    },
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    wordPlay(e) {
        let src = e.currentTarget.dataset.audio;
        console.log(src);
        app.AppAudio.src = src;
        app.AppAudio.play();
    },
    buyBtn() {
        wx.navigateTo({ url: '../buy/buy' })
    },
    startHardMode() {
        if (!this.data.user.isPro) {
            Vant.Dialog.alert({
                message: '会员专享内容，请先开通会员',
                confirmButtonText: '知道了'
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
        this.storeBindings.destroyStoreBindings()
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
    // 用户点击右上角分享
    onShareAppMessage: function (res) {
        return Store.defaultShareInfo;
    },
})