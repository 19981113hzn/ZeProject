// import ComposeOssLocal from '@itouchtv/compose-oss-local';
import { virtualFileFromDataUrl } from './VirtualFile';
import { loadScript } from '../utils';


let composeOssIndex = 0;

export const COMPOSEOSS_TYPE = {
    AVATAR: 'AVATAR',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    FILE: 'FILE'
};

const appendComposeOssElementToBody = () => {
    composeOssIndex += 1;

    const containerId = `composeoss-container-${composeOssIndex}`;
    const containerElement = document.createElement('div');
    containerElement.setAttribute('id', containerId);

    const uploadButtonId = `composeoss-button-${composeOssIndex}`;
    const uploadButtonElement = document.createElement('div');
    uploadButtonElement.setAttribute('id', uploadButtonId);

    containerElement.appendChild(uploadButtonElement);
    containerElement.style.cssText = `
        position: fixed;
        top: -100;
        left: -100;
        width: 0;
        height: 0;
        opacity: 0
    `;

    document.body.appendChild(containerElement);

    return {
        container: containerElement,
        containerId: containerId,
        uploadButton: uploadButtonElement,
        uploadButtonId: uploadButtonId,
    };
};

export const generateTokenHost = (tokenRaw = {}, type) => {
    const {
        accessKeyId,
        accessKeySecret,
        securityToken,
    } = tokenRaw || {};
    let position = '';
    switch (type) {
        case COMPOSEOSS_TYPE.AVATAR:
            position = 'avatarPosition';
            break;
        case COMPOSEOSS_TYPE.IMAGE:
            position = 'imagePosition';
            break;
        case COMPOSEOSS_TYPE.VIDEO:
            position = 'videoPosition';
            break;
        case COMPOSEOSS_TYPE.FILE:
            position = 'attachPosition';
            break;
        default:
            break;
    }
    const {
        bucket, directory, visitHost, filename 
    } = tokenRaw[position] || {};
    return {
        token: {
            AccessKeyId: accessKeyId,
            AccessKeySecret: accessKeySecret,
            SecurityToken: securityToken,
            dir: directory,
            bucket: bucket,
            region: 'oss-cn-shenzhen'
        },
        host: visitHost,
        filename
    };
};

const generateDefaultOptions = (options, type) => {
    let uploadTypeDefault = 'direct';
    let multipleDefault = false;
    let maxSizeDefault = 5;
    const uploadImmediatelyDefault = true;
    let typesDefault = [];
    switch (type) {
        case COMPOSEOSS_TYPE.IMAGE:
            uploadTypeDefault = 'direct';
            maxSizeDefault = 5;
            multipleDefault = true;
            typesDefault = [
                'image/jpeg',
                'image/jpg',
                'image/png'
            ];
            break;
        case COMPOSEOSS_TYPE.VIDEO:
            uploadTypeDefault = 'multipart';
            maxSizeDefault = 2048;
            typesDefault = [
                '.flv',
                '.mpg',
                '.mpeg',
                '.avi',
                '.wmv',
                '.mov',
                '.asf',
                '.rm',
                '.rmvb',
                '.mkv',
                '.m4v',
                '.mp4'
            ];
            break;
        case COMPOSEOSS_TYPE.FILE:
            uploadTypeDefault = 'direct';
            maxSizeDefault = 2048;
            typesDefault = [
                '.doc',
                '.docx',
                '.xls',
                '.xlsx',
                '.zip',
                '.rar'
            ];
            break;
        default:
            break;
    }

    const {
        uploadType = uploadTypeDefault,
        multiple = multipleDefault,
        maxSize = maxSizeDefault,
        uploadImmediately = uploadImmediatelyDefault,
        types = typesDefault
    } = options;
    return {
        uploadType,
        multiple,
        maxSize,
        uploadImmediately,
        types
    };
};

const newComposeOssInstance = async (options = {}, { uploadButtonId, containerId }) => {
    if (!window['ComposeOss_1.1.0']) {
        await loadScript('//img2-cloud.itouchtv.cn/sitecdn/utils/composeOss_sdk_1.1.0.js');
    }
    console.warn('newComposeOssInstance', window.ComposeOss);
    const ComposeOss = window['ComposeOss_1.1.0'];
    // const ComposeOss = ComposeOssLocal;
    const {
        // -----------------------------------
        ossType = 'OSS',
        // -----------------------------------
        type,
        token: tokenRaw,
        // -----------------------------------
        handleExpire = () => { },
        fileAdded = (uploadList, uploader) => { },
        progress = (a, b) => { },
        error = (err) => { },
        complete = (res) => { },
        completeQueue = () => { },
        // -----------------------------------
        getTokenWithMime
        // -----------------------------------
    } = options || {};
    const {
        uploadType,
        multiple,
        maxSize,
        uploadImmediately,
        types,
    } = generateDefaultOptions(options || {}, type);
    const { token, host } = generateTokenHost(tokenRaw, type);
    console.warn('%ccreateComposeOss generateTokenHost', token, host, tokenRaw);
    return new ComposeOss({
        /** {@link} http://192.168.31.49:3000/zhuhuishao/m-compose-oss */
        ossType, // 存储商: OSS (阿里云) / QINIU (七牛云) / COS (腾讯云) / VOD (腾讯云)
        uploadType, // 上传类型: direct (直传) / multipart (断点分片)
        multiple, // 是否允许多选
        maxSize, // 文件大小限制
        uploadImmediately, // 是否立刻上传
        token, // 上传token
        host, // 上传host
        types, // 文件上传类型
        upload_button: uploadButtonId, // 上传触发元素id
        container: containerId, // upload_button父元素
        handleExpire, // token认证错误
        fileAdded, // 文件添加回调
        progress, // 进度事件
        error, // 错误回调
        complete, // 完成回调
        completeQueue, // 队列完成回调
        getTokenWithMime
    });
};

const generatorRandomNumber = (() => {
    let randomIndex = 1;
    return () => {
        randomIndex += 1;
        return '' + Math.random() + randomIndex;
    };
})();


const createComposeOss = async (options) => {
    const {
        container,
        containerId,
        uploadButton,
        uploadButtonId,
    } = appendComposeOssElementToBody();
    const oss = await newComposeOssInstance(options, { uploadButtonId, containerId });

    console.warn('createComposeOss options', oss, options);

    return {
        oss,
        upload() {
            uploadButton.click();
        },
        async uploadBase64(base64Data, name) {
            const uploadPromise = new Promise((res, rej) => {
                const { _file: file } = virtualFileFromDataUrl(base64Data, name);
                const fileNameList = name?.split('/') || '';
                const fileName = fileNameList[fileNameList.length - 1];
                const { token: { dir = '' } = {} } = oss;
                console.warn('uploadBase64', oss, fileName);
                const uploadOptions = {
                    file,
                    fileName: dir + generatorRandomNumber() + fileName,
                    token: oss.token,
                    host: oss.host,
                    ossType: oss.type,
                    getTokenWithMime: oss.getTokenWithMime,
                    ...oss.restOptions,
                    complete(data) {
                        res(data);
                    }
                };
                console.warn('oss uploadBase64', oss, oss.uploader);
                // eslint-disable-next-line
                const task = new oss.uploader(uploadOptions);
                task.start(() => { }, rej);
            });

            return uploadPromise;
        },
        destroy() {
            document.body.removeChild(container);
        },
    };
};

export default createComposeOss;
