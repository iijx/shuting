export default {
    user: {
        _id: '',
        openid: ''
    },

    setUser(user = {}) {
        if(user.openid) {
            this.user.openid = user.openid;
        }
        if (user._id) {
            this.user._id = user._id;
        }

        wx.setStorageSync('l_user', JSON.stringify(this.user));
    },

    curLevel: -1,
    subLevelLearnedMap: {},


    setSingleSubLevelLearned(key, value) {
        XData.subLevelLearnedMap[key] = value;
        wx.setStorageSync('l_subLevelLearnedMap', JSON.stringify(XData.subLevelLearnedMap));
    },

    init() {
        // 用户信息
        let l_user = wx.getStorageSync('l_user'); 
        if(l_user) this.user = JSON.parse(l_user);

        // 上次学习级别记录
        let l_curLevel = wx.getStorageSync('l_curLevel');
        if (l_curLevel) this.user = JSON.parse(l_curLevel);

        // 学习分数记录
        let l_subLevelLearnedMap = wx.getStorageSync('l_subLevelLearnedMap');
        if (l_subLevelLearnedMap) this.subLevelLearnedMap= JSON.parse(wx.getStorageSync('l_subLevelLearnedMap'));
    },

    getShareInfo(page = '/pages/index/index', title = '', params = '') {
        if (!title) {
            title = '数听英语，专项练习数字听力'
        }
        if (params) {
            params += `&fromOpenid=${this.user.openid}`
        } else {
            params = `fromOpenid=${this.user.openid}`
        }
        return {
            page: `${page}?${params}`,
            title: title
        }
    },
}