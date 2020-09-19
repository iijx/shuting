module.exports = class {
    constructor(opt = {}) {
        this.isRefund = false;
        this.refundStatus = 'unstart'; // 'unstart' || 'checking' || 'refunding' || 'redunded'
        this.lRecord = [];
        this.openid = opt.openid || '';
        this.learnTaskStatus = 'pending'; // 'pending' || 'success' || 'fail'
        this.shareTaskStatus = 'pending'; // 'pending' || 'checking' || 'success'
        this.sharedImg = ''
        this.startTime = opt.startTime || Date.now();

        this.out_trade_no = opt.out_trade_no || ''
        this.payjs_order_id = opt.payjs_order_id || ''
    }
}