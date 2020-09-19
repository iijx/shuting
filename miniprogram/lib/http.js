import Config from '../config'
class Http {
    constructor(opt) {
        let { baseUrl = '' } = opt;
        this.baseUrl = baseUrl;
    }
    get (url) {
        return this.request({
            url,
            method: 'GET'
        });
    }
    post (url, data) {
        return this.request({
            url,
            data
        })
    }
    request (opt) {
        let that = this;
        let { url, data = {}, method = 'POST', dataType = 'json' } = opt;
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data,
                method,
                header: {
                    'content-type': 'application/json'
                },
                dataType: dataType,
                success: function (res) {
                    console.log('raw res', res);
                    // 如果状态码是 2xx 说明正确
                    var code = res.statusCode + '';
                    if (code && (code.charAt(0) === '2')) {
                        resolve(res.data);
                    } else {
                        
                    }
                },
                fail: function (err = 'request fail 失败') {
                    reject(err);
                },
                complete: function () {
                    // console.log('request complete');
                }
            })
        })
    }
}

export default new Http({
    baseUrl: Config.baseUrl
})