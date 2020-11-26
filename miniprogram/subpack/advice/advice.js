// pages/advice/advice.js

const app = getApp();
const { Util, UniApi, Vant } = app;
Page({

    /**
     * Page initial data
     */
    data: {
        isSubmiting: false,
        value: '',
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {

    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },
    onInput(e) {
        this.setData({
            value: e.detail.value
        })
    },
    onSubmit() {
        if (this.data.isSubmiting) return;

        if (!this.data.value.trim()) {
            Vant.Notify({type: 'warning', message: '请输入内容'});
            return;
        }

        this.setData({
            isSubmiting: true,
        });
        UniApi.cloud('advice', {
            operate: 'add',
            content: this.data.value,
        }).then(res => {
            Vant.Notify({type: 'success', message: '提交成功'});
            this.setData({
                isSubmiting: false,
            })
        })
    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {

    },
})