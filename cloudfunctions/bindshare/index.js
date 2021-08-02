// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event)
    const { fromOpenid, moniDeviceId, batteryLevel, timestamp } = event;

    await db.collection('bind').add({
        data: {
            fromOpenid,
            moniDeviceId,
            batteryLevel,
            timestamp,
            createdAt: Date.now()
        }
    })
    return true;
}