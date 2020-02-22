//app.js
import * as Util from "./lib/util";
import XData from "./lib/xdata";
import Config from './config.js'

XData.init();
console.log(XData);

App({
    onLaunch: function(opt) {
        console.log(opt);
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'dev-c7oqs', // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源, 此处请填入环境 ID, 环境 ID 可打开云控制台查看
                traceUser: true,
            })
            // 如果未登录过，则登录
            if (!XData.user.openid) {
                wx.cloud.callFunction({
                    name: 'login',
                    data: {
                        fromOpenid: opt.query.fromOpenid
                    },
                    success: res => {
                        console.log('[云函数] [login] user openid: ', res)
                        XData.setUser({
                            openid: res.result.openid,
                            _id: res.result._id
                        })
                    },
                    fail: err => {
                        console.error('[云函数] [login] 调用失败', err)
                    }
                })
            }

            

            
        }
    },
    Util,
    Config,
    XData,
})