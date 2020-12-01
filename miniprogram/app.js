//app.js
import * as Util from "./lib/util";
import Config from './config.js'
import UniApi from './lib/uniApi.js'
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import create from './lib/westore/create';
import Models from './models/index';
import store from './store/index';
import UniAudio from './lib/uniAudio';
import Http from './lib/http'

wx.loadFontFace({
    family: 'PT Mono',
    source: 'url("https://cdn.iijx.site/font/PTM55F.ttf")',
    success: console.log
})

const appData = {
    onLaunch: function(opt) {
        console.log('onLaunch', opt)
        if (!wx.cloud) wx.showLoading({ title: '请先更新微信' })
        else {
            if (opt.scene === 1154) {
                store.setEnv({ isSingleMode: true })
            } else {
                this.init(opt);
            }
        }
    },
    init(opt) {
        this.DB = wx.cloud.database();
        this.setSystemInfo();
        this._initUserData(opt);
        this.Vant = { Dialog, Toast };
        
    },
    _initUserData(opt) {
        UniApi.appCloud('user', 'get', { fromOpenid: opt.query.fromOpenid || '', openid: opt.query.openid || '' }).then(res => {
            store.data.user = res;
            store.update();
            this.learnLog();
            if (!res.isPro) {
                wx.setStorage({ key: "isPro", data: "false" })
            }
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
            store.setCurLearn(res[1].curLearnUnitId)
        })
    },
    // 学习打点日志
    learnLog() {
        console.log('learnLog', String(store.data.user.memberType))
        if (String(store.data.user.memberType) === '20') {
            console.log('learnLog1')
            let lastEnterLogTime = parseInt(wx.getStorageSync('l_log_lastEnterTime')) || 0;
            if (!Util.isSameDay(new Date(), new Date(lastEnterLogTime))) {
                this.DB.collection('duju').where({ openid: store.data.user.openid }).update({
                    data: {
                        lRecord: this.DB.command.push(Date.now())
                    }
                })
                wx.setStorage({key: 'l_log_lastEnterTime', data: String(Date.now()) });
            } else {
                console.log('今天已经打过点了，无需打点')
            }
        } else {
            console.log('learnLog0')
        }
    },
    setSystemInfo: (function() {
        let promise;
        return function() {
            if (promise) return promise;
            promise = new Promise((resolve, reject) => {
                wx.getSystemInfo({
                    success: function (res) {
                        // res.platform = 'ios'; 'android'
                        store.setEnv({
                            platform: Config.env === 'dev' ? 'android' : res.platform // 'devtools' || 'android' || 'ios'
                        })
                        resolve(res)
                    },
                    fail: function() {
                        reject({})
                    }
                })
            });
            return promise;
        }
    })(),
    onShow: function (options) {
        console.log('onShow options', options);
        // 关于支付
        if (options.referrerInfo && options.referrerInfo.appId === 'wx959c8c1fb2d877b5') { 
          // 还应判断请求路径
            let extraData = options.referrerInfo.extraData
            this.globalData.paySuccess = extraData.success
            this.globalData.payjsOrderId = extraData.payjsOrderId
        }
        if (options.scene === 1035) { // 公众号自定义菜单
            this.setSystemInfo().then(res => {
                if (res.platform === 'ios' && wx.getStorageSync('isPro') === 'false') {
                    console.log('检测开没会员');
                    this.DB.collection('exchange_code').where({ status: 2 }).get().then(codes => {
                        if (codes.data.length > 0) {
                            wx.getClipboardData({
                                success: res => {
                                    if (res && res.data && /^[0-9A-Za-z]{6,10}/.test(res.data)) {
                                        UniApi.appCloud('excCode', 'use', { code: res.data })
                                            .then(res => {
                                                if (res.success) {
                                                    Vant.Dialog.alert({
                                                        message: '恭喜开通会员'
                                                    });
                                                    UniApi.appCloud('user', 'get').then(res => {
                                                        store.data.user = res;
                                                        store.update();
                                                    });
                                                }
                                            })
                                    } 
                                }
                            })
                        }
                    })
                }
            })
        }
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
    Models,
    Http,
    uniAudio: new UniAudio(),
    assAudio: new UniAudio(),
    createPage: opt => create(store, {
        onShareAppMessage() {
            return store.getDefaultShareInfo();
        },
        onShareTimeline() {
            return {
                imageUrl: `${Config.cdnDomain}/shuting/common/icon-shuting-eng.png`,
                title: '刻意练习 · 提升数字英语听力'
            }
        },
        timelineImgClick() {
            wx.switchTab({
                url: '../index/index'
            })
        },
        ...opt,
    })
};

App(appData);