import {pointNum, pointNumLen } from './pointNum';
/**
 * 生成 [min, max) 范围随机数
 */
export const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const sleep = time => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(true)
    }, time);
})
export const MonthWords = [
    {
        word: 'January',
        phonetic: "'dʒænju.eri",
        mean: '一月',
        audio: '/assets/audio/month/month_1.mp3',
    },
    {
        word: 'February',
        phonetic: "'febru.eri",
        mean: '二月',
        audio: '/assets/audio/month/month_2.mp3',
    },
    {
        word: 'March',
        phonetic: "mɑrtʃ",
        mean: '三月',
        audio: '/assets/audio/month/month_3.mp3',
    },
    {
        word: 'April',
        phonetic: "'eɪprəl",
        mean: '四月',
        audio: '/assets/audio/month/month_4.mp3',
    },
    {
        word: 'May',
        phonetic: "meɪ",
        mean: '五月',
        audio: '/assets/audio/month/month_5.mp3',
    },
    {
        word: 'June',
        phonetic: "dʒun",
        mean: '六月',
        audio: '/assets/audio/month/month_6.mp3',
    },
    {
        word: 'July',
        phonetic: "dʒʊˈlaɪ",
        mean: '七月',
        audio: '/assets/audio/month/month_7.mp3',
    },
    {
        word: 'August',
        phonetic: "'ɔɡəst",
        mean: '八月',
        audio: '/assets/audio/month/month_8.mp3',
    },
    {
        word: 'September',
        phonetic: "sep'tembər",
        mean: '九月',
        audio: '/assets/audio/month/month_9.mp3',
    },
    {
        word: 'October',
        phonetic: "ɑk'toʊbər",
        mean: '十月',
        audio: '/assets/audio/month/month_10.mp3',
    },
    {
        word: 'November',
        phonetic: "noʊ'vembər",
        mean: '十一月',
        audio: '/assets/audio/month/month_11.mp3',
    },
    {
        word: 'December',
        phonetic: "dɪ'sembər",
        mean: '十二月',
        audio: '/assets/audio/month/month_12.mp3',
    },
];

export const WeekWords = [
    {
        word: 'Monday',
        phonetic: "ˈmʌnˌdeɪ",
        mean: '星期一',
        audio: '/assets/audio/week/week_1.mp3',
    },
    {
        word: 'Tuesday',
        phonetic: "ˈtuzˌdeɪ",
        mean: '星期二',
        audio: '/assets/audio/week/week_2.mp3',
    },
    {
        word: 'Wednesday',
        phonetic: "ˈwenzˌdeɪ",
        mean: '星期三',
        audio: '/assets/audio/week/week_3.mp3',
    },
    {
        word: 'Thursday',
        phonetic: "ˈθɜr(r)zdeɪ",
        mean: '星期四',
        audio: '/assets/audio/week/week_4.mp3',
    },
    {
        word: 'Friday',
        phonetic: "ˈfraɪdeɪ",
        mean: '星期五',
        audio: '/assets/audio/week/week_5.mp3',
    },
    {
        word: 'Saturday',
        phonetic: "ˈsætə(r)deɪ",
        mean: '星期六',
        audio: '/assets/audio/week/week_6.mp3',
    },
    {
        word: 'Sunday',
        phonetic: "ˈsʌndeɪ",
        mean: '星期日',
        audio: '/assets/audio/week/week_7.mp3',
    },
]

const SixNums = ["100003", "100048", "100126", "100135", "100169", "100214", "100223", "100224", "100225", "103744", "127958", "152530", "163897", "174146", "176814", "226948", "232615", "253499", "255695", "255841", "265210", "273520", "327526", "343043", "361085", "362618", "375360", "408038", "469762", "470306", "472241", "479018", "508829", "575357", "635875", "650760", "662248", "678676", "719586", "736393", "750018", "783915", "788319", "811166", "833069", "889969", "894916", "900522", "937846", "942246", "955138", "958514", "960650", "966382", "988830", "996555", "996796", "999169"];

export const fourPhones = ["1022","1072","1157","1160","1200","1263","1282","1321","1358","1459","1559","1585","1593","1662","1746","1799","1808","1809","1811","1837","1923","1970","1992","2002","2013","2065","2115","2176","2208","2233","2278","2446","2489","2567","2586","2611","2663","2772","2798","2801","2803","2828","2846","2854","2908","2943","3027","3139","3174","3255","3306","3406","3437","3444","3544","3566","3602","3612","3616","3637","3667","3761","3788","3807","3872","3958","4032","4033","4038","4109","4260","4273","4329","4350","4424","4432","4514","4515","4560","4573","4608","4662","4691","4693","4701","4858","5012","5021","5042","5100","5112","5127","5252","5314","5338","5357","5455","5487","5498","5507","5522","5556","5580","5630","5686","5698","5755","5760","5885","5896","5921","5975","5985","6037","6074","6097","6104","6124","6137","6176","6182","6407","6420","6426","6475","6496","6549","6554","6649","6670","6677","6710","6847","6872","6891","6892","6893","6900","6937","6947","6956","6967","7129","7168","7179","7225","7227","7306","7389","7392","7411","7436","7487","7556","7570","7587","7596","7627","7785","7796","7879","7975","7997","8107","8123","8137","8184","8200","8269","8324","8336","8475","8480","8600","8656","8670","8749","8780","8796","8836","8949","8989","9152","9181","9242","9272","9503","9524","9525","9680","9690","9726","9741","9761","9919","9981","9990","9995"].map(item => parseInt(item));

export const sixPhones = ["103128","107395","107731","108144","110429","111846","119550","120553","120587","124140","124649","126701","128591","129963","134687","138633","141581","143598","145408","146554","147072","148356","148824","155266","157543","162886","163987","169342","170587","175398","203354","211746","216738","222990","223635","248499","251148","253557","254128","256921","262621","269524","271774","273215","273763","283512","288037","290228","292192","292407","295005","295314","296541","300274","302001","302702","319662","319765","321189","324832","325972","328591","336890","346739","349993","351530","361386","365724","367858","368777","389911","392959","408249","417475","424276","435801","436242","437321","444618","444837","448146","448897","449194","452298","458275","467636","468195","471367","474328","477383","482761","484401","485904","488294","493733","497527","504343","508515","513446","515600","515721","515723","517819","523217","524095","524856","528932","536261","538386","539184","540198","542287","542709","543049","543228","544533","553003","564392","568319","574111","589358","591960","607965","608758","610680","613279","614033","618954","628514","632443","640259","656572","657928","658697","663038","664904","665036","681105","689515","701195","709742","713485","717767","719059","721114","721979","731174","747439","753324","757354","759084","760669","762346","762809","765021","765026","767036","773384","781275","786666","787434","791322","794907","799195","811758","817291","820759","826964","829286","834200","835978","860706","863452","869292","870158","873330","880630","882268","884896","889894","895005","896111","904763","908881","915374","915898","919978","923668","924198","947277","948336","951930","953918","959230","959552","962098","962956","968292"].map(item => parseInt(item));

export const eightPhones = ["11799765", "13981342", "15100990", "16967709", "18792071", "19495517", "20888442", "21745867", "21892437", "31096870", "36147953", "36737566", "37280571", "37613984", "37802749", "41288380", "48405645", "53057306", "55583344", "57149554", "58522501", "59029339", "60206962", "63323598", "64827914", "68399646", "68611400", "79973713", "80977480", "81099669", "83148042", "86104492", "87892680", "90612889", "94423656", "95875949", "97197512", "98247962", "98635280", "98925716"].map(item => parseInt(item));

const ALL_TIMES = ["1230", "1235", "1245", "0100", "0115", "0225", "0230", "0305", "0335", "0405", "0445", "0450", "0505", "0540", "0545", "0610", "0615", "0710", "0715", "0725", "0730", "0810", "0825", "0855", "0905", "0925", "1005", "1015", "1030", "1200", "1205", "1330", "1340", "1410", "1430", "1435", "1545", "1550", "1555", "1600", "1605", "1620", "1630", "1645", "1710", "1730", "1800", "1910", "2000", "2010", "2020", "2025", "2040", "2045", "2050", "2135", "2210", "2215", "2220", "2235", "2255", "2300", "2320"];


export const randomOneTime = (() => {
    let len = ALL_TIMES.length;
    return () => ALL_TIMES[randomIntegerInRange(0, len)]; 
})();

export const randomOnePhone = length => {

    let arr = [];
    if (length === 4) arr = fourPhones;
    else if (length === 6) arr = sixPhones;
    else if (length === 8) arr = eightPhones;
    
    let len = arr.length;

    return () => arr[randomIntegerInRange(0, len)];
};

export const randomOneNum = length => {
    // 这里特殊处理一下，如果是1位数，让其包括0
    let min = gen10ExpNum(length - 1);
    
    if (length === 6) return SixNums[randomIntegerInRange(0, SixNums.length)]
    else return randomIntegerInRange(min === 1 ? 0 : min, gen10ExpNum(length));
    // else if (length === 7) return SixNums[randomIntegerInRange(0, SevenNums.length)]
    // else if (length === 8) return SixNums[randomIntegerInRange(0, EightNums.length)]
}

export const randomOneYear = () => {
    return randomIntegerInRange(1800, 2028);
}

export const randomPointNumber = () => {
    return pointNum[randomIntegerInRange(0, pointNumLen)];
}

export const randomOneWeek = () => {
    return randomIntegerInRange(1, 8);
}

export const genExpNum = (num, expNum) => {
    if (expNum === 0) return 1;

    let ret = num;
    for(let i = 0; i < expNum - 1; i++) {
        ret *= num;
    }
    return ret;
}

export const randomOneMonth = () => {
    return randomIntegerInRange(1, 13);
}

// “节流”函数（避免重复触发fn函数
export const throttle = (fn, wait = 300) => {
    let lastTime = null;
    return function () {
        let curTime = (new Date()).getTime();
        // 距离下次触发fn还需等待的时间(如果没有lastTime说明是第一次，可以表示执行，即等待时间为0
        let remainTime = lastTime ? wait - (curTime - lastTime) : 0;
        if (remainTime <= 0 || remainTime > wait) {
            lastTime = curTime;
            return fn.apply(this, arguments);
        }
    }
}

export const gen10ExpNum = expNum => genExpNum(10, expNum);

export const dateFormatter = (date, formatter) => {
    date = (date ? new Date(date) : new Date)
    const Y = date.getFullYear() + '',
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds()
    return formatter.replace(/YYYY|yyyy/g, Y)
        .replace(/YY|yy/g, Y.substr(2, 2))
        .replace(/MM/g, (M < 10 ? '0' : '') + M)
        .replace(/DD/g, (D < 10 ? '0' : '') + D)
        .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
        .replace(/mm/g, (m < 10 ? '0' : '') + m)
        .replace(/ss/g, (s < 10 ? '0' : '') + s)
}

// 是否同一天
export const isSameDay = (day1, day2) => {
    return day1.setHours(0, 0, 0, 0) === day2.setHours(0, 0, 0, 0)
}

// 是否为今天
export const isToday = day => {
    return isSameDay(new Date(), day)
}
// 是否为明天
export const isTomorrow = date => {
    let tomorrow = new Date(Date.now() + 24 * 3600 * 1000)
    return isSameDay(new Date(tomorrow), date)
}
// 是否为昨天
export const isYestday = date => {
    let curDate = new Date()
    let todayStart = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate()
    ).getTime()
    let yestdayStart = new Date(todayStart - 24 * 3600 * 1000).getTime()

    return date.getTime() < todayStart && yestdayStart <= date.getTime()
}
/**
 * 判断指定某一天 date 是否在range范围内
 * @param {*} day
 * @param {Array} range: [beginDay, endDay]
 */
export const dateIsBetween = (day, range) => {
    if (range[0].getTime() <= day.getTime() && day.getTime() <= range[1].getTime()) {
        return true
    } else return false
}


/**
 * 日期比较，仅仅比较天数
 * @param {*} day1
 * @param {*} day2
 * -1, 0, 1
 */
export const compareDateByDay = (day1, day2) => {
    if (day1.setHours(0, 0, 0, 0) === day2.setHours(0, 0, 0, 0)) return 0;
    else return day1 > day2 ? 1 : -1;
}