export default class User {
    constructor(opt) {
        this._id = opt._id || String;
        this.isPro = opt.isPro || false;
        this.openid = opt.openid || '';
        this.avatar = opt.avatar || '';
        this.nickName = opt.nickName || '';
        this.proEndDate = opt.proEndDate || new Date('1970-01-01');

        this.isBuyOver24Hour = opt.isBuyOver24Hour || false;
        this.isPaid = opt.isPaid || false;
    }
}