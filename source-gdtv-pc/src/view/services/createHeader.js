import MD5 from 'crypto-js/md5';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import userUtils from 'Utils/userUtils';

function createHeaders(method, requestUrl, bodyStream) {
    const { getUser, getJWT, getDeviceId } = userUtils;

    const Timestamp = new Date().getTime();
    let headers = {};

    const key = '89541443007807288657755311869534';
    const secret = 'dfkcY1c3sfuw0Cii9DWjOUO3iQy2hqlDxyvDXd1oVMxwYAJSgeB6phO8eW1dfuwX';

    let md5 = '';
    let contentMD5 = '';

    if (bodyStream) {
        md5 = MD5(bodyStream);
        contentMD5 = Base64.stringify(md5);
    }

    const stringToSigned = `${method}\n${requestUrl}\n${Timestamp}\n${contentMD5}`;

    const sign = Base64.stringify(HmacSHA256(stringToSigned, secret));

    headers = {
        'Content-Type': 'application/json',
        'X-ITOUCHTV-Ca-Timestamp': Timestamp,
        'X-ITOUCHTV-Ca-Signature': sign,
        'X-ITOUCHTV-Ca-Key': key,
        'X-ITOUCHTV-CLIENT': 'WEB_PC',
        'X-ITOUCHTV-DEVICE-ID': global.__DEVICEID__ || getDeviceId()
    };

    if (getJWT()) {
        headers.Authorization = getJWT();
    }

    if (getUser() && getUser().pk) {
        headers['X-ITOUCHTV-USER-PK'] = getUser().pk;
    }

    if (global.__X_FORWARDED_FOR__) {
        headers['X-Forwarded-For'] = global.__X_FORWARDED_FOR__;
    }
    // console.log(headers);
    return headers;
}

export default createHeaders;
