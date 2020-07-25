

import config from '../config';
import lesson from '../local/lesson';
import LearnRecord from '../models/learnRecord';

wx.cloud.init({
    env: {
        database: config.cloudEnv,
        storage: config.cloudEnv,
        functions: config.cloudEnv
    }, // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源, 此处请填入环境 ID, 环境 ID 可打开云控制台查看
    traceUser: true,
})

/**
 * 所有的正在请求的map: <key, promise>, 其中 key 为 `${cloudName}_${model}_${operate}`
 */
const reqMap = {};

const learnInfo = (() => {
    let curLearnUnitId;
    let learnRecords = [];
    // 上次学习级别记录
    if (wx.getStorageSync('l_version') === '3.0') {
        curLearnUnitId = Number(wx.getStorageSync('l_curLearnUnitId') || '11');
        learnRecords = JSON.parse(wx.getStorageSync('l_learnRecords') || '[]').map(i => new LearnRecord(i));
    }
    else if (wx.getStorageSync('l_version') === '2.0') {
        curLearnUnitId = Number(wx.getStorageSync('l_curSubLevelId') || '11');
        learnRecords = JSON.parse(wx.getStorageSync('l_subLevelLearnedMap') || '[]').map(item => ({
            ...item,
            cNum: Math.round(item.score * 3 / 20),
            eNum: 0
        })).map(i => new LearnRecord(i));
        // 将2.0数据转换成3.0数据
        wx.clearStorageSync()
        wx.setStorageSync('l_curLearnUnitId', String(curLearnUnitId));
        wx.setStorageSync('l_learnRecords', JSON.stringify(learnRecords));
        wx.setStorageSync('l_version', '3.0');
    } else {
        curLearnUnitId = 11;
        learnRecords = [];
        wx.clearStorageSync()
        wx.setStorageSync('l_version', "3.0")
        wx.setStorageSync('l_curLearnUnitId', "11")
    }
    return {
        curLearnUnitId,
        learnRecords
    }
})();


const localApi = opt => {
    const { model } = opt;
    return new Promise((resolve, reject) => {
        if (model === 'lesson') {
            setTimeout(() => {
                resolve(lesson);
            }, 1000)
        } else if (model === 'learnInfo') {
            resolve(learnInfo)
        }
    })
}

// reqMap Clearer 
const reqMapClearer = function clear(){
    for (const [key, promise] of Object.entries(reqMap)) {
        promise.then(() => {
            if (reqMap[key]) {
                delete reqMap[key];
            }
        })
    }
    setTimeout(() => clear(), 1000);
};
setTimeout(() => reqMapClearer(), 2000);

const cloud = (name = 'appCloud', data = { model: '', operate: 'get'}) => {
    const key = `${name}_${data.model}_${data.operate || ''}`;
    if (reqMap[key]) return reqMap[key];
    else {
        if (name === 'local') {
            reqMap[key] = localApi(data);
        } else {
            reqMap[key] = new Promise((resolve, reject) => {
                wx.cloud.callFunction({
                    name,
                    data: {...data},
                    success: res => {
                        if (config.env === 'dev') {
                            console.log(`【cloud-${name}】res =>`, res.result)
                        }
                        resolve(res.result)
                    },
                    fail: err => reject(err)
                })
            });
        }

        return reqMap[key];
    }
    
}

export default {
    cloud,
    // login
}