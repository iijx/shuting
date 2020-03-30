
export const LevelList = [
    {
        levelId: 1,
        title: '数字',
        index: 1,
    },
    {
        levelId: 2,
        title: '电话',
        index: 2,
    },
    { 
        levelId: 3,
        title: '其它',
        index: 3,
    }
]
// 系列
const subP1 = [
    {
        pLevelId: 1,
        levelId: 11,
        type: 'number',
        title: '1位',
        maxLength: 1,
        isPro: false,
        index: 1,
    },
    {
        pLevelId: 1,
        levelId: 12,
        type: 'number',
        title: '2位',
        maxLength: 2,
        isPro: false,
        index: 2,
    },
    {
        pLevelId: 1,
        levelId: 13,
        type: 'number',
        title: '3位',
        isPro: true,
        maxLength: 3,
        index: 3,
    },
    {
        pLevelId: 1,
        levelId: 14,
        type: 'number',
        title: '4位',
        maxLength: 4,
        isPro: true,
        index: 4,
    },
    {
        pLevelId: 1,
        levelId: 15,
        type: 'number',
        title: '5位',
        maxLength: 5,
        isPro: true,
        index: 5,
    },
    {
        pLevelId: 1,
        levelId: 16,
        type: 'number',
        title: '6位',
        isPro: true,

        maxLength: 6,
        index: 6,
    },
    {
        pLevelId: 1,
        levelId: 17,
        type: 'number',
        title: '7位',
        isPro: true,

        maxLength: 7,
        index: 7,
    },
    {
        pLevelId: 1,
        levelId: 18,
        type: 'number',
        title: '8位',
        isPro: true,

        maxLength: 8,
        index: 8,
    },
    {
        pLevelId: 1,
        levelId: 19,
        type: 'number',
        title: '9位',
        isPro: true,

        maxLength: 9,
        index: 9,
    },
];

const subP2 = [
     // 电话系列
     {
        pLevelId: 2,
        levelId: 21,
        type: 'phone',
        title: '4位',
        isPro: true,
        maxLength: 4,
        index: 1,
    },
    {
        pLevelId: 2,
        levelId: 22,
        type: 'phone',
        title: '6位',
        maxLength: 6,
        isPro: true,
        index: 2,
    },
    {
        pLevelId: 2,
        levelId: 23,
        type: 'phone',
        title: '8位',
        isPro: true,
        maxLength: 8,
        index: 3,
    },
];

const subP3 = [
    // 其他系列
    {
        pLevelId: 3,
        levelId: 31,
        type: 'pointNum',
        title: '小数',
        maxLength: 6,
        isPro: true,
        index: 1,
    },
    {
        pLevelId: 3,
        levelId: 32,
        type: 'year',
        title: '年份',
        maxLength: 4,
        isPro: true,
        index: 2,
        widthIcon: true
    },
    {
        pLevelId: 3,
        levelId: 33,
        type: 'month',
        title: '月份',
        isPro: true,
        maxLength: 8,
        index: 3,
        widthIcon: true
    },
    // {
    //     pLevelId: 3,
    //     levelId: 34,
    //     type: 'week',
    //     title: '星期',
    //     maxLength: 4,
    //     isPro: true,
    //     index: 4,
    //     widthIcon: true
    // },
    {
        pLevelId: 3,
        levelId: 35,
        type: 'time',
        title: '24h时间',
        isPro: true,
        maxLength: 8,
        index: 4,
    },
]
export const SubLevelList = [
    ...subP1,
    ...subP2,
    ...subP3
]