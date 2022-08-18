const consumeUploadTokenPrivate = uploadTokenPrivate => {
    return {
        videoToken: {
            AccessKeyId: uploadTokenPrivate.accessKeyId,
            AccessKeySecret: uploadTokenPrivate.accessKeySecret,
            SecurityToken: uploadTokenPrivate.securityToken,
            bucket:
                uploadTokenPrivate.videoPosition &&
                uploadTokenPrivate.videoPosition.bucket,
            dir:
                uploadTokenPrivate.videoPosition &&
                uploadTokenPrivate.videoPosition.directory,
            region: 'oss-cn-shenzhen'
        },
        audioToken: {
            AccessKeyId: uploadTokenPrivate.accessKeyId,
            AccessKeySecret: uploadTokenPrivate.accessKeySecret,
            SecurityToken: uploadTokenPrivate.securityToken,
            bucket:
                uploadTokenPrivate.audioPosition &&
                uploadTokenPrivate.audioPosition.bucket,
            dir:
                uploadTokenPrivate.audioPosition &&
                uploadTokenPrivate.audioPosition.directory,
            region: 'oss-cn-shenzhen'
        },
        audioHost:
            uploadTokenPrivate.audioPosition &&
            uploadTokenPrivate.audioPosition.visitHost,
        videoHost:
            uploadTokenPrivate.videoPosition &&
            uploadTokenPrivate.videoPosition.visitHost,
        coverHost:
            uploadTokenPrivate.videoPosition &&
            uploadTokenPrivate.videoPosition.coverHost
    };
};

export default consumeUploadTokenPrivate;

