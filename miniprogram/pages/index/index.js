//index.js
const app = getApp()
import { LevelList, SubLevelList } from '../../lib/level.js';
Page({
    data: {
        
        curLevel: {},
        curSubLevelList: [],
        curSubLevel: {},
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
        
    },
    onShow: function() {
        let { curLevel, curSubLevel } = app.globalData;

        if (curLevel) {
            let curSubLevelList = [...(SubLevelList.filter(item => item.pLevel === curLevel))];

            this.setData({
                curLevel: { ...LevelList.find(item => item.level === curLevel) } || {},
                curSubLevelList: [...curSubLevelList],
                curSubLevel: curSubLevel ? { ...curSubLevel } : { ...curSubLevelList[0] }
            })
        }
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
                url: '../learn/learn?subLevel=' + this.data.curSubLevel.level,
            })
        }
    },
    switchChange(e) {
        console.log(e);
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
        return {
            path: '/pages/index/index',
            title: '我在数听英语提升听力',
        }
    },
})