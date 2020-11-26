const getScoreByCNum = cNum => {
    if (cNum >= 15) return 100;
    return Math.min(10, cNum) * 5 + Math.max(0, cNum - 10) * 10
}
export default class LearnRecord {
    constructor(opt = {}) {
        this.unitId = opt.unitId || opt.subLevelId || '';
        this.score = getScoreByCNum(opt.cNum || 0) || opt.score || 0;
        this.cNum = opt.cNum || 0;
        this.eNum = opt.eNum || 0;
    }
}