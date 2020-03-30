//app.js
import * as Util from "./lib/util";
import Config from './config.js'
import UniApi from './lib/uniApi.js'
import XData from './lib/xData.js'

import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import Notify from '/@vant/weapp/notify/notify';

import { createStoreBindings } from 'mobx-miniprogram-bindings'
import store from './lib/store'
const Vant = {
    Dialog,
    Toast,
    Notify
}

const DB = wx.cloud.database();

App({
    onLaunch: function(opt) {
        console.log(opt);
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
            wx.showLoading({
                title: '请先更新微信',
            })
        } else {
            // 登录获取用户信息
            UniApi.login(opt.query.fromOpenid || '', opt.query.openid || '');
      
            UniApi.cloud('config').then(res => {
                if (res.success) {
                    XData.goods = [...res.goods];
                    XData.version = {...res.version};
                    XData.iosMemberPromptText = res.iosMemberPromptText || XData.iosMemberPromptText;
                    XData.isShowIosMemberPrompt = res.isShowIosMemberPrompt || false;

                    XData.activity = res.activity || [];
                    XData.monitorRule = res.monitorRule || [];

                    XData.memberBanner = {...res.memberBanner};
                }
            });

            // UniApi.cloud('a_script')
        }
    },
    onShow: function (options) {
        console.log('app onshow', options);
        // 关于支付
        if (options.referrerInfo && options.referrerInfo.appId === 'wx959c8c1fb2d877b5') { 
          // 还应判断请求路径
          let extraData = options.referrerInfo.extraData
          this.globalData.paySuccess = extraData.success
          this.globalData.payjsOrderId = extraData.payjsOrderId
        }

        // 关于翻翻卡
        if (options.query.fflCardShareOpenid) {
            UniApi.cloud('fanfanle', {
                operate: 'addShare',
                sharedUserOpenid: options.query.fflCardShareOpenid
            })
        }

        // 关于班长邀请
        if (options.query.fromOpenid) {
            DB.collection('invite').add({data: {
                inviter: options.query.fromOpenid,
                nickName: '',
                createAt: Date.now(),
                updateAt: Date.now()
            }})
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
    XData,
    DB,
    AppAudio: wx.createInnerAudioContext()
})