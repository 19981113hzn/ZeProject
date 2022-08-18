```js
<ItouchtvImageUploader
    /** @params 图片url字符串 */
    value={coverUrl}
    /** @return {string} 图片改变事件, 返回图片url字符串 */
    onChange={this.onCoverChange}
    /** @params 图片裁剪的宽高比例 */
    aspectRatio={{
        width: 410,
        height: 230
    }}
    /** ------------------------------ */
    /** (可选项) */
    /** @params 可供选择的图片数组 */
    dataSource={newsContentImageList}
    /** @return {Array[string]} 上传图片数组改变事件, 返回全部上传图片url数组 */
    onDataChange={this.onCoverDataSourceChange}
    /** @params composeOss配置项 */
    composeOssOptions={{
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
        completeQueue // 队列完成回调
    }}
/>
```
