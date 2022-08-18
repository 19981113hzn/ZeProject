import { Modal } from 'antd';
import axios from 'axios';
import createHeaders from './createHeader';

export const callApi = (endpoint, method, data, options) => {
    const bodyStream = data && method.toUpperCase() !== 'GET' ? JSON.stringify(data) : '';
    endpoint = paramsForGetMethod(endpoint, method, data);

    const headers = createHeaders(method, endpoint, bodyStream);
    const { __X_FORWARDED_FOR__: xForwardedFor = '', logger } = global;

    const disableResponseType = options && options.disableResponseType;
    const returnRes = options && !!options.returnRes;
    const responseType = options && options.responseType;

    return new Promise((resolve, reject) => {
        axios({
            method: method || 'POST',
            url: endpoint,
            data: bodyStream,
            timeout: 20000,
            ...!disableResponseType && {
                responseType: responseType || 'json'
            },
            headers: headers
        }).then((res) => {
            // 打印接口请求日志
            logger && logger.log('fetch success:', xForwardedFor, res.config.method.toUpperCase(), `status ${res.status}`, endpoint);
            // console.log(`fetch success: ${res.config.method.toUpperCase()} ${res.status} ${endpoint}`);
            resolve(res.data || (returnRes && res));
        }).catch((err) => {
            if (err.response) {
                const error = err.response || {};
                const { errorCode, errorMessage } = error.data || {};
                if (typeof window == 'object' && errorCode) {
                    Modal.destroyAll();
                    Modal.error({
                        title: errorMessage
                    });
                }

                // 打印错误日志
                logger && logger.error('fetch error:', xForwardedFor, error.config.method.toUpperCase(), `status ${error.status}`, endpoint);

                // console.log(`fetch error: ${error.config.method.toUpperCase()} ${error.status} ${endpoint} ${JSON.stringify(error.data)}`);

                return reject(error.data);
            }

            console.log(`fetch error: ${method.toUpperCase()} ${endpoint}`);
            logger && logger.error(err);
            return reject(err);
        });
    });
};


// 设置请求方法GET的参数
function paramsForGetMethod(endpoint, method, data) {
    if (method.toUpperCase() === 'GET' && data && typeof (data) == 'object') {
        const paramsArr = [];
        const keys = Object.keys(data);
        keys.forEach(key => {
            if (data[key] != undefined) {
                paramsArr.push(`${key}=${data[key].toString()}`);
            }
        });
        endpoint = paramsArr.length ? `${endpoint}?${paramsArr.join('&')}` : endpoint;
    }

    return endpoint;
}
