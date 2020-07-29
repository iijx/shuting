module.exports = class User {
    constructor(opt) {
        this.openid = opt.openid || '';
        this.avatar = opt.avatar || '';
        this.nickName = opt.nickName || '';
        this.isPro = false;
        this.proEndDate = 0;
        this.memberType = -1;
        this.isPaid = false;
        
        this.createAt = Date.now();
        this.updateAt = Date.now();
    }
}