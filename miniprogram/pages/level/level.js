// pages/level/level.js

const app = getApp();
const { Util, UniApi, Vant, Store, CreateStoreBindings } = app;
import { LevelList, SubLevelList } from '../../lib/level.js';

Page({

    /**
     * Page initial data
     */
    data: {
        levelList: [],
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
                levelList
            })
        })
        
       
    },
    
    selectBtn: function(e) {
        let subLevel = e.currentTarget.dataset.level;
        if (subLevel.isPro && !this.data.user.isPro) {
            Vant.Dialog.alert({
                message: '会员专享内容，请先开通会员',
                confirmButtonText: '知道了'
            })
            return;
        }
        this.setCurSubLevelId(subLevel.levelId);
        wx.nextTick(() => {
            wx.redirectTo({
                url: '../learn/learn',
            })
        })
        // let level = e.currentTarget.dataset.level;
        // if (level.levelId === this.data.curLevel.levelId) return;

        // // 会员判定
        // let list = SubLevelList.filter(item => item.pLevelId === level.levelId).sort((a, b) => a.index - b.index);
        // console.log(list);

        // if (!this.data.user.isPro && list[0].isPro) {
        //     Vant.Dialog.alert({
        //         message: '会员专享内容，请先开通会员'
        //     })
        // } else {
        //     this.setCurSubLevelId(list[0].levelId);
        //     Vant.Dialog.confirm({
        //         title: '恭喜',
        //         message: '选择成功，快去学习吧！',
        //         confirmButtonText: '去学习',
        //         cancelButtonText: '知道了'
        //     }).then(() => {
        //         wx.redirectTo({
        //             url: '../learn/learn',
        //         })
        //     }).catch(() => {
                
        //     })
        // }
    },
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    buyBtn() {
        // if (this.data.systemInfo_platform !== 'android') return;

        wx.navigateTo({
            url: '../buy/buy',
        })
    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {
        
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