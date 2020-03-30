

import store from './store'
import config from '../config';

wx.cloud.init({
    env: {
        database: config.cloudEnv,
        storage: config.cloudEnv,
        functions: config.cloudEnv
    }, // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源, 此处请填入环境 ID, 环境 ID 可打开云控制台查看
    traceUser: true,
})

const cloud = (name = '', data = {}) => {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name,
            data: {...data},
            success: res => {
                // if (config.env === 'dev') {
                    console.log(`[云函数]-[${name}] success res =>`, res.result)
                // }
                resolve(res.result)
            },
            fail: err => reject(err)
        })
    })
}

export const login = (fromOpenid = '', openid = '') => {
    return cloud('login', { fromOpenid, openid })
        .then(res => {
            store.setUser(res);
            return res;
        })
        
}

export default {
    cloud,
    login
}