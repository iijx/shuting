
export default [
    {
        "levelId": 1,
        "title": "数字",
        "rank": 1,
        "unitList": [
            { unitId: 11, title: "1位", isPro: false, rank: 1 },
            { unitId: 12, title: "2位", isPro: false, rank: 2 },
            { unitId: 13, title: "3位", isPro: true, rank: 3 },
            { unitId: 14, title: "4位", isPro: true, rank: 4 },
            { unitId: 15, title: "5位", isPro: true, rank: 5 },
            { unitId: 16, title: "6位", isPro: true, rank: 6 },
            { unitId: 17, title: "7位", isPro: true, rank: 7 },
            { unitId: 18, title: "8位", isPro: true, rank: 8 },
            { unitId: 19, title: "9位", isPro: true, rank: 9 }
        ].map(i => ({
            ...i,
            levelId: 1,
            type: "number",
            length: i.rank,
        }))
    },
    {
        "levelId": 2,
        "title": "电话",
        "rank": 2,
        "unitList": [
            { unitId: 20, title: "3位", length: 3, isPro: false, rank: 1},
            { unitId: 21, title: "4位", length: 4, isPro: true, rank: 2},
            { unitId: 22, title: "6位", length: 6, isPro: true, rank: 3},
            { unitId: 23, title: "8位", length: 8, isPro: true, rank: 4},
            { unitId: 24, title: "10位", length: 10, isPro: true, rank: 5},
            { unitId: 25, title: "12位", length: 12, isPro: true, rank: 6},
            { unitId: 26, title: "16位", length: 16, isPro: true, rank: 7}
        ].map(i => ({
            ...i,
            levelId: 2,
            type: 'phone'

        }))
    },
    { 
        "levelId": 3,
        "title": "其它",
        "rank": 3,
        "unitList": [
            { unitId: 31, type: "point", title: "小数", isPro: true, rank: 1 },
            { unitId: 32, type: "year", title: "年份", isPro: true, rank: 2 },
            { unitId: 33, type: "month", title: "月份", isPro: true, rank: 3 },
            { unitId: 34, type: "week", title: "星期", isPro: true, rank: 4 },
            { unitId: 35, type: "time", title: "时间", isPro: true, rank: 5 }
        ].map(i => ({...i, levelId: 3 }))
    }
]

