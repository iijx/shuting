import { LevelList, SubLevelList } from './level.js';
import { observable, action } from 'mobx-miniprogram'
import Config from '../config'

const store = observable({

    // 用户信息
    user: {
        _id: '',
        isPro: false,
        openid: '',
        avatar: '',
        nickName: '',
        proEndDate: new Date('1970-01-01'),
        isMonitor: false,
        totalMoney: 0,
        usedMoney: 0,
        memberType: -1,
    },
    systemInfo: {},
    get systemInfo_platform() {
        if(Config.env === 'dev') return 'android';

        return this.systemInfo.platform;
    }, 
    // 我的消息
    messages: [],

    get newMessageNum() {
        return this.messages.reduce((ac, cur) => {
            if(cur.msgType === 1) {
                if (cur.exchangeCodeStatus === 2) {
                    ac += 1;
                }
            }
            return ac;
        }, 0)
    },

    // 分享奖励信息
    awardedNumByShare: 0, // 分享活动已奖励次数
    remainInviteCount: 0, // 剩余未奖励的邀请次数

    // 学习信息
    curSubLevelId: -1, // 当前学习的子级别的levelId
    subLevelLearnedMap: [], // 每个学过的子级别的分数

    get curSubLevel() {
        return {...SubLevelList.find(item => item.levelId === this.curSubLevelId)};
    },
    get curLevel() {
        if (this.curSubLevel && this.curSubLevel.pLevelId)
            return { ...LevelList.find(item => item.levelId === this.curSubLevel.pLevelId)};
        else return {}
    },
    get curSubLevelList() {
        return [...(SubLevelList.filter(item => item.pLevelId === this.curSubLevel.pLevelId))].sort((a, b) => a.index - b.index)
    },
    get curSubLevelScore() {
        let info = this.subLevelLearnedMap.find(item => item.subLevelId === this.curSubLevelId);
        if (!info) return 0;
        else return info.score;
    },


    get defaultShareInfo() {
        return {
            imageUrl: 'http://cdnword.iijx.site/assets/imgs/shuting/share.png',
            path: `/pages/index/index?fromOpenid=${this.user.openid}`,
            title: '数听英语·专项提升数字听力'
        }
    },

    // actions
    setUser: action(function (_user) {
        console.log('setUser', _user);
        if (_user._id) this.user._id = _user._id;
        if (_user.openid) this.user.openid = _user.openid;
        if (_user.avatar) this.user.avatar = _user.avatar;
        if (_user.nickName) this.user.nickName = _user.nickName;
        if (_user.isPro) this.user.isPro = _user.isPro;
        if (_user.proEndDate) this.user.proEndDate = _user.proEndDate;
        if (_user.isMonitor) this.user.isMonitor = _user.isMonitor || false;
        if (_user.totalMoney) this.user.totalMoney = _user.totalMoney || 0;
        if (_user.usedMoney) this.user.usedMoney = _user.usedMoney || 0;
        if (_user.memberType) this.user.memberType = Number(_user.memberType) || 0;
    }),

    setMessages:action(function (_msgList = []) {
        this.messages = [..._msgList];
    }),

    setAwardedNumByShare: action(function (num) {
        this.awardedNumByShare = num;
    }),

    setRemainInviteCount: action(function (num) {
        this.remainInviteCount = num;
    }),

    setCurSubLevelId: action(function(num) {
        this.curSubLevelId = num;
        wx.setStorageSync('l_curSubLevelId', JSON.stringify(this.curSubLevelId));
    }),

    setSubLevelLearned: action(function(arr = []) {
        this.subLevelLearnedMap = [...arr];
    }),
    setSingleSubLevelLearned: action(function(subLevelId, score) {
        let item = this.subLevelLearnedMap.find(item => item.subLevelId === subLevelId);
        if (item) {
            item.score = score;
            if (score >= 100) {
                item.isComplete = true;
            }
        } else this.subLevelLearnedMap.push({
            subLevelId: subLevelId,
            score,
            isComplete: score >= 100
        })
        wx.setStorageSync('l_subLevelLearnedMap', JSON.stringify(this.subLevelLearnedMap));
    }),

    setSystemInfo: action(function(info) {
        this.systemInfo = {...info};
    }),


    autoNextSubLevel: action(function() {
        // 1. 直接查找跟当前子级别具有【相同父级别，序号+1】的子级别
        let nextSubLevel = SubLevelList.find(item => item.pLevelId === this.curLevel.levelId && item.index === this.curSubLevel.index + 1);
        // 2. 如果没有找到，说明当前子级别是该父级别下最后一个了
        if (!nextSubLevel) {
            // 2.1 找到下一个父级别
            let nextLevel = LevelList.find(item => item.index === this.curLevel.index + 1);
            // 2.1.1 如果没有父级别，说明不用改了
            if (!nextLevel) return;
            // 2.1.2 找到了返回，父级别第一个
            else nextSubLevel = SubLevelList.filter(item => item.pLevelId === nextLevel.levelId).sort((a, b) => a.index - b.index)[0];
        }

        let errMsg = '';
        if (nextSubLevel) {
            if (!this.user.isPro && nextSubLevel.isPro) {
                errMsg = '请先开通会员';
            } else {
                this.setCurSubLevelId(nextSubLevel.levelId);
            }
        } else errMsg = '没有更多级别课程了';

        return {
            success: errMsg ? false : true,
            msg: errMsg
        }
    }),


})

;(() => {
    // 上次学习级别记录
    if (wx.getStorageSync('l_version') === '2.0') {
        let l_curSubLevelId = wx.getStorageSync('l_curSubLevelId') || '11';
        if (l_curSubLevelId) store.setCurSubLevelId(JSON.parse(l_curSubLevelId));
        let l_subLevelLearnedMap = wx.getStorageSync('l_subLevelLearnedMap');
        if (l_subLevelLearnedMap) store.setSubLevelLearned(JSON.parse(wx.getStorageSync('l_subLevelLearnedMap')));
    } else {
        wx.clearStorageSync();
        store.setCurSubLevelId(11);
        wx.setStorageSync('l_version', "2.0")
        wx.setStorageSync('l_curSubLevelId', "11")
    }

    wx.getSystemInfo({
        success (res) {
            // if (res.platform === 'devtools') res.platform = 'android';
            store.setSystemInfo({
                platform: res.platform
            })
        }
    })
    

})();



export default store;