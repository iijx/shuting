//index.js
const app = getApp()
const { Util, UniApi, Vant, Store, CreateStoreBindings } = app;
import { LevelList, SubLevelList } from '../../lib/level.js';
Page({
    data: {
        numSwitch: {
            value: false,
            maxLength: 2,
            includeDecimal: false,
        },

        timeSwitch: {
            value: false
        },

        phoneSwitch: {
            value: false,
            maxLength: 4
        }
    },
    onLoad: function() {
        // 数据绑定
        this.storeBindings = CreateStoreBindings(this, {
            store: Store,
            fields: ['defaultShareInfo', 'user', 'curLevel', 'curSubLevel', 'curSubLevelList', 'subLevelLearnedMap'],
        })
    },
    genLearnParams: {
        
    },
    toLearn() {
        if(this.data.curSubLevelList.length <= 0) {
            wx.switchTab({
                url: '../level/level',
            })
        } else {
            wx.redirectTo({
                url: '../learn/learn',
            })
        }
    },
    switchChange(e) {
        if(e.detail.type === 'num') this.data.numSwitch.value = e.detail.value;
        else if(e.detail.type === 'time') this.data.timeSwitch.value = e.detail.value;
        else if(e.detail.type === 'phone') this.data.phoneSwitch.value = e.detail.value;

        this.setData({
            numSwitch: this.data.numSwitch,
            timeSwitch: this.data.timeSwitch,
            phoneSwitch: this.data.phoneSwitch,
        })
    },
    // 用户点击右上角分享
    onShareAppMessage: function (res) {
        return this.defaultShareInfo;
    },
    onUnload: function() {
        this.storeBindings.destroyStoreBindings()
    }
})