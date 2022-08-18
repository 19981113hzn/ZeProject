import { message } from 'antd';

const onComposeOssError = (err) => {
    switch (err.code) {
        case '-601': // unsupported file format
        case -601:
            message.error('不支持该格式文件');
            break;
        case '-600': // over the maximum size
        case -600:
            message.error('图片上传超过最大尺寸');
            break;
        default:
            message.error('上传失败，请重新上传');
            break;
    }
};

export default onComposeOssError;
