import crypto from 'crypto';

const publicKeyStr = '-----BEGIN PUBLIC KEY-----\n'
    + 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALLUiZV6DVmAcJGOsWzftnYxDVpIdTlQynYeTtq5Z1ZzUteINPX24GyeetbYjnIT8pq0IdXGEjjBtngvddR0YaMCAwEAAQ==\n'
    + '-----END PUBLIC KEY-----';

export default function encrypt(str) {
    const encryptStr = crypto.publicEncrypt({
        key: publicKeyStr,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(str, 'utf8'));
    return encryptStr.toString('base64');
}
