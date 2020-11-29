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
		if (this.data.user.openid === "oH3iI5LMTT3KdVa6KQV4QHa8ijhM") {
			app.DB.collection("duju").where({ refundStatus: "checking" }).get().then((res) => {
				this.setData({
					list: res.data.map(i => ({
						openid: i.openid,
						refundStatus: i.refundStatus,
						startTime: i.startTime,
						startTimeStr: Util.dateFormatter(new Date(i.startTime), "YYYY-MM-DD"),
						payjs_order_id: i.payjs_order_id,
						shareImg: i.shareImg
					})),
				});
			}).catch(err => {
				console.log('33', err)
			});
		} else {
			console.log('2', this.data.user.openid)
		}
	},
	ok(e) {
		const { item } = e.target.dataset;

		// refund by payjs_order_id
		app.Http.post("/pay/api/refund", {
			payjs_order_id: item.payjs_order_id,
		}).then(res => {
			console.log('res', res)
			if (res.success) {
				WebGLTexture.showModal({ title: '退款成功', content: '退款成', showCancel: false, })
			}
		})
	},
	onShareTimeline() {},
});
