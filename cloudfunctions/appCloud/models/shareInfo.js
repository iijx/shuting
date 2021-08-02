
module.exports = class ShareInfo {
    constructor(openid) {
        this.openid = openid;
        this.invitedUser = [];
        this.isUsedFreeMember = false; // 已经用过了免费奖励
        this.awardRecords = [];
        this.totalMoney = 0;
        this.usedMoney = 0;

        this.createAt = new Date();
        this.updateAt = new Date();
    }
    addInvitedUser(openid) {
        this.invitedUser.push(openid);
        return this;
    }
}