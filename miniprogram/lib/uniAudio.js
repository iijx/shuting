export default class UniAudio {
    init () {
        this.audioInstance = wx.createInnerAudioContext();
        this.audioInstance.onCanplay(() => this.onCanPlay())
        this.audioInstance.onEnded(() => this.onEnded())
    }
    onCanPlay() {
        this.canPlayCB();
    }
    onEnded() {
        if (typeof this.endedCB === 'function') {
            this.endedCB();
        }
    }
    setSrc(src) {
        if (!this.audioInstance) this.init();
        return new Promise((resolve, reject) => {
            this.audioInstance.src = src;
            this.canPlayCB = function() { resolve() }
        })
    }
    play(end) {
        this.audioInstance.play();
        if (end && typeof end === 'function') {
            this.endedCB = end;
        }
    }
    stop() {
        this.audioInstance.stop();
    }
}