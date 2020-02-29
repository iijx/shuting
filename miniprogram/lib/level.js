
export const LevelList = [
    {
        levelId: 1,
        note: "短数字，短电话",
        title: '级别 I',
        index: 1,
    },
    {
        levelId: 2,
        note: "数字更长，电话更长，",
        title: '级别 II',
        index: 2,
    },
    { 
        levelId: 3,
        note: "24h时间，百万数字，8位电话",
        title: '级别 III',
        index: 3,
    }
]

export const SubLevelList = [
    // 级别1
    {
        pLevelId: 1,
        levelId: 11,
        type: 'number',
        title: '数字2位',
        maxLength: 2,
        isPro: false,
        index: 1,
    },
    {
        pLevelId: 1,
        levelId: 12,
        type: 'number',
        title: '数字3位',
        isPro: true,
        maxLength: 3,
        index: 2,
    },
    {
        pLevelId: 1,
        levelId: 13,
        type: 'phone',
        title: '电话4位',
        isPro: true,
        maxLength: 4,
        index: 3,
    },

    // 级别 2
    {
        pLevelId: 2,
        levelId: 21,
        type: 'number',
        title: '数字4位',
        maxLength: 4,
        isPro: true,

        index: 1,
    },
    {
        pLevelId: 2,
        levelId: 22,
        type: 'number',
        title: '数字5位',
        maxLength: 5,
        isPro: true,

        index: 2,
    },
    {
        pLevelId: 2,
        levelId: 23,
        type: 'phone',
        title: '电话6位',
        maxLength: 6,
        isPro: true,

        index: 3,
    },

    // 级别 3
    {
        pLevelId: 3,
        levelId: 31,
        type: 'time',
        title: '24h时间',
        isPro: true,
        maxLength: 8,
        index: 1,
    },
    {
        pLevelId: 3,
        levelId: 32,
        type: 'number',
        title: '数字6位',
        isPro: true,

        maxLength: 6,
        index: 2,
    },
    {
        pLevelId: 3,
        levelId: 33,
        type: 'phone',
        title: '电话8位',
        isPro: true,
        maxLength: 8,
        index: 3,
    },
]