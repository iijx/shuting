//index.js
const app = getApp()

Page({
    data: {
    },
    onLoad: function() {
        
    },
    toLearn() {
        wx.redirectTo({
            url: '../learn/learn',
        })
    }


})