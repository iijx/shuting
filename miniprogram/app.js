//app.js
import * as Util from "./lib/util";
import Config from './config.js'
import UniApi from './lib/uniApi.js'

import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

import { createStoreBindings } from 'mobx-miniprogram-bindings'
import store from './lib/store'
const Vant = {
    Dialog,
    Toast
}

App({
    onLaunch: function(opt) {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
            wx.showLoading({
                title: '请先更新微信',
            })
        } else {
            // 登录获取用户信息
            UniApi.login(opt.query.fromOpenid || '');
            // UniApi.cloud('login', {
            //     fromOpenid: opt.query.fromOpenid
            // }).then(res => {
            //     store.setUser({
            //         openid: res.openid,
            //         _id: res._id
            //     })
            // }).catch(err => {
            //     console.error('[云函数] [login] 调用失败', err)
            // })

            // UniApi.cloud('uploadFile')
        }
    },
    Util,
    Config,
    UniApi,
    Store: store,
    CreateStoreBindings: createStoreBindings,

    Vant,
})