
const ENV_PROD = 'prod-mxd6w';
const ENV_DEV = 'dev-c7oqs';

// const env = 'dev'; // prod || dev
const env = 'prod'; // prod || dev

export default {
    env,
    cloudEnv: env === 'prod' ? ENV_PROD : ENV_DEV,

    cdnDomain: 'https://cdn.amathclass.cn',
    cdnPathPrefix: '/shuting/eng',
    correctAudioSrc: '/assets/audio/correct.mp3',
    errorAudioSrc: '/assets/audio/error.mp3',
    
    baseUrl: 'https://shuting.iijx.site'
}