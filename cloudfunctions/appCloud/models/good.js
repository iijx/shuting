module.exports = class {
    constructor(type, day, price, oldPrice) {
        this.title = '数听会员',
        this.name = `数听会员 · ${day}天`,
        this.memberDay = day;
        this.memberType = type;
        this.totalFee = Math.round(price * 100);
        this.price = price;
        this.oldPrice = oldPrice;

        this.rank = 1;
        this.isCustom = false;
        this.isRecommend = false;
        this.activityNote = '';
    }
    setCustom() {
        this.isCustom = true;
        return this;
    }
    setRank(rank) {
        this.rank = rank;
        return this;
    }
    setRecommend() {
        this.isRecommend = true;
        return this;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setActiviteNote(note) {
        this.activityNote = note;
        return this;
    }

}