
export const LevelList = [
    {
        level: 1,
        note: "短数字",
        title: '级别 I',
        isPro: false,
        index: 1,
    },
    {
        level: 2,
        note: "短电话，数字更长",
        title: '级别 II',
        isPro: true,
        index: 2,
    },
    {
        level: 3,
        note: "24h时间，百万数字，8位电话",
        title: '级别 III',
        isPro: true,
        index: 3,
    }
]

export const SubLevelList = [
    // 级别1
    {
        pLevel: 1,
        level: 11,
        type: 'number',
        title: '数字2',
        maxLength: 2,
        index: 1,
    },
    {
        pLevel: 1,
        level: 12,
        type: 'number',
        title: '数字3',
        maxLength: 3,
        index: 2,
    },

    // 级别 2
    {
        pLevel: 2,
        level: 11,
        type: 'number',
        title: '数字4',
        maxLength: 4
    },
    {
        pLevel: 2,
        level: 12,
        type: 'phone',
        title: '电话',
        maxLength: 4
    },

    // 级别 3
    {
        pLevel: 3,
        level: 11,
        type: 'number',
        title: '数字2',
        maxLength: 2
    },
    {
        pLevel: 3,
        level: 12,
        type: 'number',
        title: '数字3',
        maxLength: 3
    },
]

export const getNextSubLevel = (pLevel, curLevelIndex) => {
    let subLevelList = SubLevelList.filter(item => item.pLevel + '' === pLevel + '');
    if (subLevelList[curLevelIndex + 1]) return {...subLevelList[curLevelIndex + 1]};

    const curPLevel = LevelList.find(item => item.level + '' === pLevel + '');

    const nextPLevel = LevelList[curPLevel.index + 1];

    // if(nextPLevel)
}