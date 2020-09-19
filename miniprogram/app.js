//app.js
import * as Util from "./lib/util";
import Config from './config.js'
import UniApi from './lib/uniApi.js'
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import Notify from '/@vant/weapp/notify/notify';
import create from './lib/westore/create';
import Models from './models/index';
import store from './store/index';
import UniAudio from './lib/uniAudio';
import Http from './lib/http'

const Vant = { Dialog, Toast, Notify }
const DB = wx.cloud.database();
wx.loadFontFace({
    family: 'PT Mono',
    source: 'url("https://iijx-cdn.oss-cn-beijing.aliyuncs.com/font/PTM55F.ttf")',
    success: console.log
})

App({
    onLaunch: function(opt) {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
            wx.showLoading({
                title: '请先更新微信',
            })
        } else {
            // 登录获取用户信息
            UniApi.appCloud('user', 'get', { fromOpenid: opt.query.fromOpenid || '', openid: opt.query.openid || '' }).then(res => {
                store.data.user = res;
                store.update();
                this.learnLog();
            })
            UniApi.appCloud('config', 'get').then(res => {
                if (res.success) {
                    store.data.goods = [...res.goods];
                    store.data.config.version = {...res.version};
                    store.data.config.iosBuyPrompt = res.iosBuyPrompt || store.data.config.iosBuyPrompt;
                    store.data.config.isAppInCheck = res.isAppInCheck || false;
                    store.data.config.freeMemberNeedCount = res.freeMemberNeedCount || 10;
                    store.data.config.shareTimelineBaseImg = res.shareTimelineBaseImg || store.data.config.shareTimelineBaseImg;
                    store.data.config.androidWithDujuRate = res.androidWithDujuRate || 0;
                    store.update();
                }
            });

            Promise.all([
                UniApi.cloud('local', { model: 'lesson' }),
                UniApi.cloud('local', { model: 'learnInfo' })
            ]).then(res => {
                store.data.rawLesson = [...res[0]];
                store.data.unitMap = res[0].reduce((ac, cur) => {
                    return cur.unitList.reduce((a, c) => {
                        a[c.unitId] = { ...c };
                        return a;
                    }, ac);
                }, {});
                
                store.data.learnRecords = [ ...res[1].learnRecords ];
                store.updateLesson();
                store.setCurLearn(res[1].curLearnUnitId)
                store.update();
            })

            wx.getSystemInfo({
                success (res) {
                    store.setEnv({
                        // platform: 'android'
                        platform: Config.env === 'dev' ? 'android' : res.platform // 'devtools' || 'android' || 'ios'
                    })
                }
            })
        }
    },
    // 学习打点日志
    learnLog() {
        if (String(store.data.user.memberType) === '20') {
            let lastEnterLogTime = parseInt(wx.getStorageSync('l_log_lastEnterTime')) || 0;
            if (!Util.isSameDay(new Date(), new Date(lastEnterLogTime))) {
                DB.collection('duju').where({ openid: store.data.user.openid }).update({
                    data: {
                        lRecord: DB.command.push(Date.now())
                    }
                })
                wx.setStorage({key: 'l_log_lastEnterTime', data: String(Date.now()) });
            } else {
                console.log('今天已经打过点了，无需打点')
            }
        }
    },
    onShow: function (options) {
        // 关于支付
        if (options.referrerInfo && options.referrerInfo.appId === 'wx959c8c1fb2d877b5') { 
          // 还应判断请求路径
            let extraData = options.referrerInfo.extraData
            this.globalData.paySuccess = extraData.success
            this.globalData.payjsOrderId = extraData.payjsOrderId
        }
        // 关于翻翻卡
        // if (options.query.fflCardShareOpenid) {
        //     UniApi.cloud('fanfanle', {
        //         operate: 'addShare',
        //         sharedUserOpenid: options.query.fflCardShareOpenid
        //     })
        // }

        // // 关于班长邀请
        // if (options.query.fromOpenid) {
        //     DB.collection('invite').add({data: {
        //         inviter: options.query.fromOpenid,
        //         nickName: '',
        //         createAt: Date.now(),
        //         updateAt: Date.now()
        //     }})
        // }
    },
    onHide() {
        this.learnLog();
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
    Vant,
    DB,
    Models,
    Http,
    uniAudio: new UniAudio(),
    assAudio: new UniAudio(),
    createPage: opt => create(store, {
        // 用户点击右上角分享
        onShareAppMessage() {
            return store.getDefaultShareInfo();
        },
        ...opt,
    })
})