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
      

            // UniApi.cloud('uploadFile')
        }
    },
    onShow: function (options) {
        console.log('app onshow', options);
        if (options.scene === 1038 && options.referrerInfo && options.referrerInfo.appId === 'wx959c8c1fb2d877b5') { 
          // 还应判断请求路径
          let extraData = options.referrerInfo.extraData
          this.globalData.paySuccess = extraData.success
          this.globalData.payjsOrderId = extraData.payjsOrderId
        }
    },
    globalData: {
        payjsOrderId: '',
        out_trade_no: '',
        paySuccess: false,

    },
    Util,
    Config,
    UniApi,
    Store: store,
    CreateStoreBindings: createStoreBindings,

    Vant,
})