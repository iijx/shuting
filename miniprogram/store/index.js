import Models from '../models/index';

const getScoreByCNum = cNum => {
    if (cNum >= 15) return 100;
    return Math.min(10, cNum) * 5 + Math.max(0, cNum - 10) * 10
}


const store = {
    data: {
        env: {
            platform: '',
            isSingleMode: false, // 是否是单页模式（即从朋友圈进入
        },
        user: new Models.User(JSON.parse(wx.getStorageSync('user') || '{}')),
        // user: new Models.User({}),
        config: {
            iosBuyPrompt: 'IOS小程序版，暂不支持开通会员功能',
            isAppInCheck: false,
            freeMemberNeedCount: 10,
            version: {},
            shareTimelineBaseImg: 'https://cdnword.iijx.site/assets/imgs/shuting/2.png',
            likeRule: [
                { title: '规则', body: '若好友点赞了您的朋友圈，第5位、第8位、第18位点赞者可获得永久会员兑换码。'},
                { title: '领取', body: '凭点赞截图，向客服换取兑换码，由您亲自转赠送给为您点赞的幸运获奖好友。'},
                { title: '活动时间', body: '购买笃局会员后7天内'},
            ],
            moreMiniP: []
        },

        goods: [],

        // 学习信息
        curLearnLevel: {},
        curLearnUnit: {},
        learnRecords: [],

        rawLesson: [], // 原始课程树（即不带学习数据）
        lesson: [], // 课程树, 带学习数据
        unitMap: {} // 单元 key-value
    },

    setEnv(env) {
        this.data.env = {
            ...this.data.env,
            ...env
        }
    },
    setCurLearn(unitId) {
        // 1. 设置当前学习单元
        this.data.curLearnUnit = { 
            ...new Models.LearnRecord({ unitId }),
            ...this.data.learnRecords.find(i => Number(i.unitId) === Number(unitId)),
            ...this.data.unitMap[unitId] 
        };
        // 2. 设置当前学习单元对应的level
        let _temp = this.data.rawLesson.find(i => i.levelId === this.data.curLearnUnit.levelId);
        this.data.curLearnLevel = {
            levelId: _temp.levelId,
            title: _temp.title,
            rank: _temp.rank
        }
        // 3. 保存至本地
        wx.setStorage({
            key: 'l_curLearnUnitId',
            data: String(unitId)
        });
    },
    // 设置单元学习数据
    setUnitLearnData(unitId, data) {
        // 1. 如果要更新的单元刚好是当前单元，则更新当前单元的数据
        if (unitId === this.data.curLearnUnit.unitId) {
            this.data.curLearnUnit.cNum = Math.max(this.data.curLearnUnit.cNum, data.cNum);
            this.data.curLearnUnit.eNum = data.eNum;
            this.data.curLearnUnit.score = getScoreByCNum(data.cNum);
        }
        // 2. 更新学习记录
        let index = this.data.learnRecords.findIndex(i => i.unitId === unitId);
        if (index !== -1) {
            this.data.learnRecords[index] = new Models.LearnRecord({
                ...this.data.learnRecords[index],
                ...data,
                cNum: Math.max(this.data.learnRecords[index].cNum, data.cNum)
            });
        } else {
            this.data.learnRecords.push(new Models.LearnRecord({
                unitId,
                ...data
            }))
        }
        wx.setStorage({
            key: 'l_learnRecords',
            data: JSON.stringify(this.data.learnRecords)
        });
    },
    // 更新带学习信息的课程树
    updateLesson() {
        store.data.lesson = this.data.rawLesson.map(i => {
            let unitList = i.unitList.map(u => {
                let uRecord = this.data.learnRecords.find(r => r.unitId === u.unitId) || {};
                return {
                    ...u,
                    cNum: uRecord.cNum || 0,
                    score: uRecord.score || 0,
                }
            })
            return {
                ...i,
                cNum: unitList.reduce((a, c) => a + c.cNum, 0),
                score: unitList.reduce((a, c) => a + c.score, 0),
                unitList,
            }
        });
    },

    getDefaultShareInfo() {
        return {
            imageUrl: 'http://cdnword.iijx.site/assets/imgs/shuting/share1.png',
            path: `/pages/level/level?fromOpenid=${this.data.user.openid}`,
            title: '刻意练习 · 提升数字英语听力'
        }
    }
}

export default store;
