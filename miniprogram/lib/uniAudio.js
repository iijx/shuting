export default class UniAudio {
    constructor() {
        this.audioInstance = wx.createInnerAudioContext();
        this.audioInstance.onCanplay(() => this.onCanPlay())
        this.audioInstance.onEnded(() => this.onEnded())
        this.audioInstance.onError(e => this.onError(e))
    }
    onCanPlay() {
        typeof this.canPlayCB === 'function' && this.canPlayCB();
    }
    onError(e) {
        console.log(e)
    }
    onEnded() {
        if (typeof this.endedCB === 'function') {
            this.endedCB();
        }
    }
    setSrc(src) {
        return new Promise((resolve, reject) => {
            if (this.audioInstance.src === src) resolve();
            else {
                this.canPlayCB = function() { resolve() }
                this.audioInstance.src = src;
            }
        })
    }
    play(end) {
        this.audioInstance.play();
        if (end && typeof end === 'function') {
            this.endedCB = end;
        }
    }
    playDD() {
        this.audioInstance.src = "/assets/audio/dingdong.m4a";
        this.audioInstance.play()
    }
    playCorrect() {
        this.audioInstance.src = "/assets/audio/correct.m4a";
        this.audioInstance.play()
    }
    playError() {
        this.audioInstance.src = "/assets/audio/error.m4a";
        this.audioInstance.play()
    }
    stop() {
        this.audioInstance.stop();
    }
}