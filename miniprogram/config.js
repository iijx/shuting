


const ENV_PROD = 'prod-mxd6w';
const ENV_DEV = 'dev-c7oqs';


const env = 'dev'; // prod || dev

export default {
    
    cloudEnv: env === 'prod' ? ENV_PROD : ENV_DEV,

    cdnDomain: 'http://cdnword.iijx.site',
    // correctAudioSrc: 'http://cdnword.iijx.site/assets/audio/commonAudio/rosetta_right.m4a',
    correctAudioSrc: '/assets/audio/correct.mp3',
    // errorAudioSrc: 'http://cdnword.iijx.site/assets/audio/commonAudio/rosetta_error.m4a',
    errorAudioSrc: '/assets/audio/wrong.mp3',

    correctScore: 5,
    errorScore: -20,
}