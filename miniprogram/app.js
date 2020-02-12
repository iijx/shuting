//app.js
import * as Util from "./lib/util";
App({
    onLaunch: function() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
            wx.redirectTo({
                url: '../chooseLib/chooseLib',
            })
        } else {
            wx.cloud.init({
                env: 'dev-c7oqs', // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源, 此处请填入环境 ID, 环境 ID 可打开云控制台查看
                traceUser: true,
            })
            // 调用云函数
            wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                    console.log('[云函数] [login] user openid: ', res)
                    this.globalData.openid = res.result.openid
                    this.globalData.userId = res.result._id
                },
                fail: err => {
                    console.error('[云函数] [login] 调用失败', err)
                }
            })
        }

        this.globalData = {
            curLevel: wx.getStorageSync('l_curLevel'),
            subLevelLearnedMap: {}
        }
    },
    Util,
    globalData: {}
})