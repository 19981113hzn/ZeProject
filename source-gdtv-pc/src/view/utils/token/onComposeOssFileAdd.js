const onComposeOssFileAdd = (uploadList, uploader) => {
    console.warn('%ctoken onComposeOssFileAdd', uploadList, uploader);
    const resultList = [];
    for (let i = 0; i < uploadList.length; i += 1) {
        const { file } = uploadList[i];
        const {
            file: fileFile, key, taskId, size, name
        } = file;
        const { name: localName } = fileFile;
        const url = window.URL.createObjectURL(fileFile);
        resultList.push({
            url,
            name,
            localName,
            key: taskId,
            size,
            file: fileFile
        });
    }
    return resultList;
};

export default onComposeOssFileAdd;
