// 云函数入口文件
const cloud = require('wx-server-sdk')


// 初始化 cloud
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const DB = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let { operate, examId, cNum, answer = [] } = event;

    if (operate === 'start') {
        await DB.collection('exam').doc(examId).update({
            data: {
                status: 2
            },
        })
    }

    else if (operate === 'answer') {
        await DB.collection('exam').doc(examId).update({
            data: {
                cNum,
                answer
            },
        })
    }

}