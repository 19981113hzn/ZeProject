
const HTTPS = 'https://';
const HTTP = 'http://';
const isProd = process.env.NODE_ENV == 'production';

// 测试环境只能访问http
const DEV = HTTP + 'dev-grtn-api.itouchtv.cn:8081';
const TEST = HTTP + 'test-grtn-api.itouchtv.cn:8081';
const PRO = HTTPS + 'gdtv-api.itouchtv.cn:7443';
const REAL = HTTPS + 'gdtv-api.gdtv.cn';

export const BASENAME = {
    localhost: TEST,
    '172.22.1.138': REAL,
    'local-gdtv.itouchtv.cn': PRO,
    'dev-gdtv.itouchtv.cn': DEV,
    'test-gdtv.itouchtv.cn': TEST,
    'gdtv.itouchtv.cn': REAL,
    'www.gdtv.cn': REAL
};

let mapBaseName = {
    tcdn: `${isProd ? HTTPS : (HTTPS + 'debug-')}tcdn-api.itouchtv.cn`
};

if (typeof window === 'object') {
    const BaseName = BASENAME[window.location.hostname] || REAL;
    mapBaseName = Object.assign({}, mapBaseName, {
        api: BaseName + '/api'
    });
} else {
    const getBaseName = () => (isProd ? 'http://172.18.32.120:8081' : 'http://192.168.31.87:8081');
    mapBaseName = Object.assign({}, mapBaseName, {
        api: getBaseName() + '/api'
    });
}

const apiBaseName = mapBaseName;

export default apiBaseName;
