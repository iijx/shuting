const app = getApp();
const { Util, Vant, Store } = app;

const avatarWH = 60;
app.createPage({
	data: {
		user: {},
		config: {},
		loadImagePath: "",
		canvasWidth: 750,
		canvasHeight: 750,

		// isHidden: false,
	},
	promiseSystemInfo() {
		return new Promise((resolve, reject) => {
			wx.getSystemInfo({
				success: (res) => {
					resolve(res);
				},
			});
		});
	},
	promiseGetImageInfo(src) {
		return new Promise((resolve, reject) => {
			wx.getImageInfo({
				src,
				success: (res) => {
					resolve(res);
				},
				fail: err => {
					reject(err);
				}
			});
		});
	},
	onLoad: function (options) {
		wx.showLoading({ title: '加载中...' });
		var ctx = wx.createCanvasContext("canvas");
		this.promiseSystemInfo().then(res => {
			this.setData({
				canvasWidth: res.windowWidth,
				canvasHeight: res.windowWidth,
			});
			this.promiseGetImageInfo(this.data.config.shareTimelineBaseImg).then(res => {
				ctx.drawImage(res.path, 0, 0, this.data.canvasWidth, this.data.canvasHeight);
				ctx.draw();
				Util.sleep(100).then(() => {
					console.log('this.data.user.avatar', this.data.user.avatar);
					this.promiseGetImageInfo(this.data.user.avatar).then(res => {
						ctx.beginPath();
						let cx = this.data.canvasWidth / 2;
						let cy = 60;
						console.log(cx, cy);
						ctx.arc(cx, cy, avatarWH / 2, 0, 2 * Math.PI);
						ctx.clip();
						ctx.drawImage(res.path, cx - avatarWH / 2, cy - avatarWH / 2, avatarWH, avatarWH);
						ctx.draw(true);
						Util.sleep(100).then(() => {
							console.log('canvasToTempFilePath')
							wx.canvasToTempFilePath({
								canvasId: "canvas",
								success: (res) => {
									console.log('canvasToTempFilePath success')
									var tempFilePath = res.tempFilePath;
									wx.hideLoading();
									this.setData({
										loadImagePath: tempFilePath,
									});
								},
								fail: function (res) {
									console.log('canvasToTempFilePath fail')
									console.log(res);
								},
							});
						})
					})
				})
			})
		})
	},

	saveImg: function () {
		wx.getSetting().then((getSettingRes) => {
			if(!getSettingRes.authSetting["scope.writePhotosAlbum"]){
				wx.authorize({ scope: "scope.writePhotosAlbum" })
					.then( res => {
						console.log("authorize",res)
					}, err => {
						wx.showModal({
							title: '提示',
							content: '保存图片功能需要您的授权',
							cancelText:'不授权',
							cancelColor:'#999',
							confirmText:'授权',
							confirmColor:'#f94218',
							success(res) {
							 	if (res.confirm) {
							   		wx.openSetting()                               
								} 
								else if (res.cancel) {
									console.log('用户点击取消')
							 	}
							}
						})
					})
			}
			else {
				wx.saveImageToPhotosAlbum({
					filePath: this.data.loadImagePath,
					success(res) {
						console.log("res", res);
						wx.showToast({
							title: "已保存到相册",
							icon: "success",
							duration: 3000,
						});
					},
				});
			}
		});

		
	},

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {},
});
