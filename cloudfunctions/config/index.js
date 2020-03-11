// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        success: true,
        goods: [
            {
                name: '月度会员 · 30天',
                isRecommend: false,
                price: 2.9,
                oldPrice: 10,
                memberType: 1,
                rank: 1,
            },
            {
                name: '半年会员 · 180天',
                isRecommend: false,
                price: 5.8,
                oldPrice: 19,
                memberType: 2,
                rank: 2,
            },
            {
                name: '终身会员 · 100年',
                isRecommend: true,
                price: 9.9,
                oldPrice: 68,
                memberType: 3,
                rank: 3,
            },
        ],
        version: {
            onlineTime: '暂无',
            status: '开发中...',
            body: ['功能规划中...']
        },

        iosMemberPromptText: ''

    }
}