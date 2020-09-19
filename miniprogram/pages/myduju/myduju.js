// pages/myduju/myduju.js
const app = getApp();
const { Util, Vant, Store } = app;

app.createPage({
	data: {
		user: {},
		fileList: [],
		sharedImg: '',
		dujuWeek: [1, 2, 3, 4, 5, 6, 7].map(i => ({num: i})),
		todayIsComplete: false,
		shareStatus: 'pending',
		learnStatus: 'pending',
		learnTipText: '_',
		shareStatusText: '进行中',
		learnStatusText: '进行中',

		refundStatus: 'unstart',

		showShare: false,
		shareOptions: [
		{ name: '分享至群聊', openType: 'share' },
		{ name: '分享到朋友圈', icon: 'http://cdn.iijx.site/img/ngts4.png' },
		]
	},
	uniqueDateArray(arr = []) {
		let res = []
		for (let i = 0; i < arr.length; i++) {
		if (res.findIndex(item => Util.isSameDay(new Date(item), new Date(arr[i]))) >= 0) {}
		else {
			res.push(arr[i]);
		}
		}
		return res;
	},
	setShareStatusText() {
		let status = this.data.shareStatus;
		let text = '';
		if (status === 'pending') text = '待完成';
		else if (status === 'checking') text = '审核中';
		else if (status === 'success') text = '挑战完成';
		this.setData({ shareStatusText: text });
	},
	setLearnStatusText() {
		let status = this.data.learnStatus;
		let text = '';
		if (status === 'pending') text = '挑战进行中';
		else if (status === 'success') text = '挑战完成';
		else if (status === 'fail') text = '挑战失败';
		this.setData({ learnStatusText: text });
	},
	setLearnTip() {
		if (this.data.learnStatus === 'pending') {
		this.setData({ learnTipText: '👏恭喜！你已完成今日学习挑战'})
		} else if (this.data.learnStatus === 'success') {
		this.setData({ learnTipText: '👏恭喜！挑战成功'})
		} else if (this.data.learnStatus === 'fail') {
		this.setData({ learnTipText: '挑战失败'})
		}
	},
	onLoad: function (options) {
		app.learnLog();
		app.UniApi.appCloud('duju', 'get').then(res => {
		let duju = res.duju;
		if (res.duju && res.duju.startTime) {
			let lRecord = this.uniqueDateArray(duju.lRecord);
			let dujuWeek = Util.getNext7dateByDate(new Date(duju.startTime)).map((item, index) => ({
				day: item.getDate(),
				num: index + 1,
				date: item,
				isToday: Util.isSameDay(new Date(), new Date(item)),
				isHistory: Util.compareDate(new Date(), item) === 1,
				isCompleted: lRecord.findIndex(ii => Util.isSameDay(new Date(ii), new Date(item))) >= 0
			}));
			// set learn status
			if (dujuWeek.findIndex(i => i.isHistory && !i.isCompleted) >= 0 ) this.data.learnStatus = 'fail';
			else if (dujuWeek.filter(i => i.isCompleted).length >= 7 ) this.data.learnStatus = 'success';
			else this.data.learnStatus = 'pending';
	
			// set share status
			this.data.shareStatus = duju.shareTaskStatus;
	
			this.setData({
				learnStatus: this.data.learnStatus,
				dujuWeek: dujuWeek,
				todayIsComplete: lRecord.findIndex(ii => Util.isSameDay(new Date(ii), new Date())) >= 0,
				refundStatus: duju.refundStatus,
				fileList: [{ url: duju.sharedImg }]
			});
	
			this.setLearnStatusText();
			this.setShareStatusText();
			this.setLearnTip()
			console.log('duju', duju)
		} else {
			wx.showModal({
				title: '提示',
				content: '您暂未会员信息',
				showCancel: false,
				success: res => {
					wx.navigateBack({ delta: 1});
				},
			})
		}
		})
	},
	delete() {
		this.setData({ fileList: []})
	},
	afterRead(e) {
		this.setData({
			fileList: [{ url: e.detail.file.path }]
		})
		wx.showLoading({
		title: '上传中',
		})
		this.uploadFilePromise(String(Date.now()), e.detail.file.path)
		.then(res => {
			wx.hideLoading();
			wx.showModal({ title: '提交成功', content: '请等待审核', showCancel: false, confirmText: '知道了'})
			app.DB.collection('duju').where({ openid: this.data.user.openid }).update({
			data: {
				shareTaskStatus: 'checking',
				sharedImg: res.fileID
			}
			})
			this.setData({ shareStatus: 'checking' })
			this.setShareStatusText();
		})
	},
	
	uploadFilePromise(fileName, path) {
		return wx.cloud.uploadFile({
		cloudPath: fileName,
		filePath: path
		});
	},
	refundBtn: Util.throttle(function() {
		if (this.data.refundStatus === 'unstart') {
		// 1. check 
		if (this.data.learnStatus === 'fail') wx.showToast({ icon: 'none', title: '笃局失败' })
		else if (this.data.learnStatus === 'pending') wx.showToast({ icon: 'none', title: '请先完成挑战' })

		else if (this.data.shareStatus === 'pending') wx.showToast({ icon: 'none', title: '请先完成挑战二' })
		else if (this.data.shareStatus === 'checking') wx.showToast({ icon: 'none', title: '挑战二审核中' })

		else {
			app.DB.collection('duju').where({ openid: this.data.user.openid }).update({
			data: {
				refundStatus: 'checking'
			}
			})
			wx.showToast({ icon: 'success', title: '已提交申请'})
			this.setData({ refundStatus: 'checking' })
		}
		}
		else if (this.data.refundStatus === 'checking') {
		wx.showToast({ icon: 'none', title: '审核中'})
		}
		else if (this.data.refundStatus === 'success') {
		wx.showToast({ icon: 'success', title: '已返还'})
		}
	}, 1000),
	openShare() {
		this.setData({ showShare: true })
	},
	onCloseShare() {
		this.setData({ showShare: false })
	},
	toTimeline() {
		wx.navigateTo({
		url: '../timeline/timeline' // 指定页面的url
		});
	},
})