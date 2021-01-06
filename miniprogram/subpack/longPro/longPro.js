const app = getApp();
const { Util, UniApi, Vant, Store } = app;
app.createPage({
	data: {
		list: [],
		user: {},
	},
	onLoad: function (options) {
		
	},
	onShow: function () {
		if (this.data.user.openid === "oH3iI5LMTT3KdVa6KQV4QHa8ijhM" || this.data.user.openid === 'oH3iI5NU9XZO4HFeRDVRQ5N2aHjs') {
			app.DB.collection("order").where({ status: 2 }).orderBy('createAt', 'desc').get().then((res) => {
                console.log(res);
				this.setData({
					list: res.data.map(i => ({
                        memberType: typeof i.attach === 'string' ? (JSON.parse(i.attach || '{}')).memberType : i.attach.memberType,
						openid: i.openid,
						payjs_order_id: i.payjs_order_id,
                        time_end: i.time_end
					})).filter(i => String(i.memberType) === '20'),
                });
                app.DB.collection("order").where({ status: 2 }).orderBy('createAt', 'desc').skip(20).get().then((res) => {
                    const list = this.data.list.concat(res.data.map(i => ({
                        memberType: typeof i.attach === 'string' ? (JSON.parse(i.attach || '{}')).memberType : i.attach.memberType,
                        openid: i.openid,
                        payjs_order_id: i.payjs_order_id,
                        time_end: i.time_end
                    })).filter(i => String(i.memberType) === '20'))
                    this.setData({ list })
                })
			}).catch(err => {
				console.log('33', err)
			});
		} else {
			console.log('2', this.data.user.openid)
		}
    },
    lookUser(e) {
        const { item } = e.target.dataset;
        app.DB.collection('users').where({ openid: item.openid }).limit(1).get().then(res => {
            console.log(res);
            const item = res.data ? res.data[0] : null;
            if (item) {
                wx.showModal({
                    title: item.nickName,
                    content: '会员结束' +  Util.dateFormatter(new Date(item.proEndDate), 'YYYY/MM/DD'),
                })
            }
        })
    },
    ok(e) {
        const { item } = e.target.dataset;
        UniApi.appCloud('user', 'setLongMember', {
            needSetOpenid: item.openid,
        }).then(res => {
            console.log('res',res);
            if (res.success) {
				wx.showModal({ title: '设置成功', content: '设置成功', showCancel: false, })
			}
        })
    },
	onShareTimeline() {},
});
