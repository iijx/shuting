


const ENV_PROD = 'prod-mxd6w';
const ENV_DEV = 'dev-c7oqs';


const env = 'prod'; // prod || dev

export default {
    
    cloudEnv: env === 'prod' ? ENV_PROD : ENV_DEV,

    cdnDomain: 'http://cdnword.iijx.site',
    correctAudioSrc: '/assets/audio/correct.m4a',
    errorAudioSrc: '/assets/audio/error.m4a',

    correctScore: 5,
    errorScore: -20,
}