// pages/papel/papel.js
const app = getApp();
const { Util, Vant, Config } = app;
import papel from "../../local/papel";
class QItem {
	constructor(opt = {}) {
		this.q = opt.q || "";
		this.o = (opt.o || []).map((i) => ({ label: i, showResClass: "" })),
		this.audio = opt.audio || "";
    	this.answer = opt.answer || 0;
    	this.origin = (opt.origin || []).map((i) => i.trim());
    	this.source = opt.source || "";
  	}
}
app.createPage({
  	data: {
		env: { isSingleMode: false },
		pageIsActive: true,
		user: new app.Models.User({}),
		config: {},

		papelArr: [...papel],
		index: 0,

		curUserAnswer: -1,
		curItem: new QItem(),

		isShowOrigin: false,
		isLoading: false,
		isPlaying: false,

		percent: 0,
		speed: 25,
	},
	onLoad: function (options) {
		let index = Number(wx.getStorageSync("l_curPapelQIndex")) || 0;
		this.setData({ index });
		this.nextWord();
	},
	onShow: function () {
		this.data.pageIsActive = true;
	},
	nextWord() {
		let item = this.data.papelArr[this.data.index];
		this.setData({
		// speed: -1,
		percent: 0,
		isPlaying: false,
		isLoading: true,
		curUserAnswer: -1,
		curItem: new QItem(item),
		});
		this.prePlay();
	},
	prePlay() {
		this.setData({ speed: 25, percent: 100 });
		let curIndex = this.data.index;
		Promise.all([ Util.sleep(4000), app.uniAudio.setSrc(`${Config.cdnDomain}/shuting/eng/papel_audio/${this.data.curItem.audio}.m4a`)])
			.then(() => {
				// 如果切换题了，就不用处理了
				if (curIndex !== this.data.index || !this.data.pageIsActive) return;
				// 否则，正常流程
				this.setData({ isLoading: false, isPlaying: true });
				app.assAudio.playDD();
				Util.sleep(2500).then(() => {
					if (curIndex !== this.data.index || !this.data.pageIsActive) return;
					app.uniAudio.play(() => {
						this.setData({ isPlaying: false });
					});
				});
			})
			.catch((err) => {
			});
	},
	audioClick() {
		if (this.isLoading) return;

		if (this.data.isPlaying) {
			app.uniAudio.stop();
			this.setData({ isPlaying: false });
		} else {
			app.uniAudio.play(() => this.setData({ isPlaying: false }));
			this.setData({ isPlaying: true });
		}
	},

	optionClick(e) {
		if (this.data.curUserAnswer !== -1) return;

		let index = e.currentTarget.dataset.index;
		this.data.curUserAnswer = index;
		if (this.data.papelArr[this.data.index].answer === index + 1) {
			this.data.curItem.o[index].showResClass = "right";
			app.assAudio.playCorrect();
		} else {
			this.data.curItem.o[index].showResClass = "error";
			this.data.curItem.o[this.data.curItem.answer - 1].showResClass = "right";
			app.assAudio.playError();
		}

		this.setData({
			curItem: { ...this.data.curItem },
		});
	},
	onHide: function () {
		this.data.pageIsActive = false;
		console.log("onHide");
		this.setData({ isPlaying: false });
		app.uniAudio.stop();
	},
	onUnload: function () {
		this.data.pageIsActive = false;
		console.log("onUnload");
		app.uniAudio.stop();
	},

	toggleOrigin() {
		this.setData({
			isShowOrigin: !this.data.isShowOrigin,
		});
	},

	showMember: function (e) {
			// 1. 会员拦截
		if (this.data.env.platform === "android") {
			Vant.Dialog.confirm({
				title: "开通会员",
				message: "会员专享内容，请先开通会员",
				cancelButtonText: "知道了",
				confirmButtonText: "去看看",
				confirmButtonColor: "#d93043",
			})
			.then((res) => {
				wx.navigateTo({ url: "../buy/buy" });
			})
			.catch((err) => {});
		} else {
			Vant.Dialog.alert({
				title: "开通会员",
				message: this.data.config.iosBuyPrompt,
				confirmButtonText: "知道了",
				confirmButtonColor: "#d93043",
			});
		}
		return;
	},

	nextQ() {
		// console.log(this.data.index, this.data.papelArr.length);
		// if (this.data.index <= this.data.papelArr.length) {
		if (this.data.index < 29) {
			if (this.data.index >= 2 && !this.data.user.isPro) {
				this.showMember();
			} else {
				app.uniAudio.stop();
				this.setData({
					index: this.data.index + 1,
				});
				wx.setStorageSync("l_curPapelQIndex", this.data.index);
				this.nextWord();
			}
		} else {
			Vant.Toast("没有更多题了");
		}
	},
	prevQ() {
		if (this.data.index > 0) {
		this.setData({
			index: this.data.index - 1,
		});
		this.nextWord();
		} else {
		Vant.Toast("已经是第一题了");
		}
	},
});
