import mime from 'mime-types';

function _readAsX(method, file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader[method](file);
        reader.onerror = function (error) {
            rej(error);
        };
        reader.onload = function () {
            res(reader.result);
        };
    });
}

let VirtualFilesIndex = 0;

export default class VirtualFile {
    constructor(file, filename) {
        const now = +(new Date());
        Object.defineProperty(this, '_file', {
            enumerable: false,
            configurable: false,
            readonly: true,
            value: file
        });

        Object.defineProperty(this, '_uid', {
            enumerable: false,
            configurable: false,
            readonly: true,
            // eslint-disable-next-line
            value: `${now}-${++VirtualFilesIndex}`
        });
        this._mimeType = mime.lookup(filename);
    }

    get type() {
        return this._mimeType;
    }

    readAsText = () => _readAsX('readAsText', this._file);

    readAsArrayBuffer = () => _readAsX('readAsArrayBuffer', this._file);

    readAsBinaryString = () => _readAsX('readAsBinaryString', this._file);

    readAsDataUrl = () => _readAsX('readAsDataURL', this._file);
}

/**
 * base64 转 blob 对象，文件上传
 * @param dataURI
 * @returns {Blob}
 */
export function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export function virtualFileFromDataUrl(dataUrl, filename) {
    const file = dataURItoBlob(dataUrl);
    return new VirtualFile(file, filename);
}
