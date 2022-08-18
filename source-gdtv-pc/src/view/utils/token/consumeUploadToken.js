const consumeUploadToken = uploadToken => {
    return {
        imageToken: {
            AccessKeyId: uploadToken.accessKeyId,
            AccessKeySecret: uploadToken.accessKeySecret,
            SecurityToken: uploadToken.securityToken,
            bucket:
                uploadToken.imagePosition &&
                uploadToken.imagePosition.bucket,
            dir:
                uploadToken.imagePosition &&
                uploadToken.imagePosition.directory,
            region: 'oss-cn-shenzhen'
        },
        host:
            uploadToken.imagePosition
            && uploadToken.imagePosition.visitHost
    };
};

export default consumeUploadToken;

