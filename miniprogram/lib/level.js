
export const LevelList = [
    {
        level: 1,
        note: "短数字",
        title: '级别 I',
        isPro: false,
    },
    {
        level: 2,
        note: "短电话，数字更长",
        title: '级别 II',
        isPro: true,
    },
    {
        level: 3,
        note: "24h时间，百万数字，8位电话",
        title: '级别 III',
        isPro: true,
    }
]

export const SubLevelList = [
    {
        pLevel: 1,
        level: 11,
        type: 'number',
        title: '数字2位',
        maxLength: 2
    },
    {
        level: 12,
        type: 'number',
        title: '数字3位',
        maxLength: 3
    },
    {
        pLevel: 2,
        level: 11,
        type: 'number',
        title: '数字2位',
        maxLength: 2
    },
    {
        pLevel: 2,
        level: 12,
        type: 'number',
        title: '数字3位',
        maxLength: 3
    },
]