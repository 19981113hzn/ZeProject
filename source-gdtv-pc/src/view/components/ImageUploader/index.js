import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import {
    Modal, Button, Icon, message
} from 'antd';

import * as GlobalActions from 'Global/actions';
import GlobalSelectors from 'Global/selectors';

import createComposeOss, { COMPOSEOSS_TYPE, generateTokenHost } from 'Utils/token/createComposeOss';
import onComposeOssError from 'Utils/token/onComposeOssError';
import onComposeOssFileAdd from 'Utils/token/onComposeOssFileAdd';
import onComposeOssComplete from 'Utils/token/onComposeOssComplete';

import ButtonUpload from './ButtonUpload';
import TabContainer from './TabContainer';
import ImageItem from './ImageItem';
import Cropper from './Cropper';
import Footer from './Footer';

import { IMAGE_UPLOAD_STATUS, IMAGE_UPLOAD_TABKEY } from './constants';

import styles from './index.less';

@connect(GlobalSelectors, {
    getUploadToken: GlobalActions.getUploadToken.request
})
class ItouchtvImageUploader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataStage: [],
            data: [],
            current: undefined,
            status: IMAGE_UPLOAD_STATUS.CHOOSE,
            isCropping: false,
            tabKey: IMAGE_UPLOAD_TABKEY.CONTENT
        };
    }

    async componentDidMount() {
        // await new Promise((resolve, reject) => {
        //     this.props.getUploadToken({ type: 0, fileFormat: 'jpeg' }, resolve, reject);
        // });
        // this.createComposeOss();
    }

    componentWillUnmount() {
        this.destroyOss && this.destroyOss();
    }

    createComposeOss = async (options = {}) => {
        const { composeOssOptions, uploadToken } = this.props;
        console.log('uploadToken', uploadToken);
        const composeOssMethods = {
            handleExpire: this.onOssExpire,
            fileAdded: this.onOssFileAdded,
            progress: this.onOssProgress,
            error: this.onOssError,
            complete: this.onOssComplete,
            completeQueue: this.onOssCompleteQueue
        };
        const {
            oss, upload, destroy, uploadBase64
        } = await createComposeOss({
            token: uploadToken.token,
            type: COMPOSEOSS_TYPE.IMAGE,
            ...composeOssMethods,
            ...composeOssOptions,
            ...options
        });
        this.oss = oss || {};
        this.uploadBase64Oss = uploadBase64;
        this.uploadOss = upload;
        this.destroyOss = destroy;
    }

    createComposeOssWithMime = async () => {
        const { composeOssOptions } = this.props;
        await this.createComposeOss({
            getTokenWithMime: async (file) => {
                const type = ((_file) => {
                    try {
                        if (!_file) {
                            return 'jpg';
                        }
                        const _type = _file && _file.type;
                        if (!_type) {
                            return 'jpg';
                        }
                        return _type.split && _type.split('/')[1] || 'jpg';
                    } catch (err) {
                        console.warn('createComposeOssWithMime getTokenWithMime err', err);
                        return 'jpg';
                    }
                })(file && file.file);
                const token = await new Promise((resolve, reject) => {
                    this.props.getUploadToken({ type: 0, fileFormat: type }, resolve, reject);
                });
                console.warn('!!getTokenWithMime createComposeOss', file, type, token, composeOssOptions.type);
                return generateTokenHost(token, composeOssOptions && composeOssOptions.type);
            }
        });
    }

    // ------------------------------------------
    onOssExpire = () => {
        console.log('ItouchtvImageUploader onOssExpired');
    }

    onOssFileAdded = (uploadList, uploader) => {
        const resultList = onComposeOssFileAdd(uploadList, uploader);
        console.log('ItouchtvImageUploader onOssFileAdded', uploadList, uploader, resultList);
        this.setState({
            dataStage: this.state.dataStage.concat(resultList)
        });
    }

    onOssProgress = (a, b) => {
        console.log('ItouchtvImageUploader onOssProgress', a, b);
    }

    onOssError = (err) => {
        const { dataStage } = this.state;
        const file = err && err.file;
        onComposeOssError(err);
        console.log('ItouchtvImageUploader onOssError', err, dataStage, file);
        if (file) {
            const index = R.findIndex(R.propEq('key', file.taskId))(dataStage);
            if (index < 0) return;
            const drop = dataStage.splice(index, 1);
            this.setState({
                dataStage
            }, () => {
                this.onOssChange();
                this.forceUpdate();
            });
        }
    }

    onOssComplete = (res) => {
        const result = onComposeOssComplete(res);
        console.log('ItouchtvImageUploader onOssComplete', res, result);

        const { dataStage, data } = this.state;
        const index = R.findIndex(R.propEq('key', result.key))(dataStage);
        console.warn('onOssComplete setState callback', dataStage, result);
        if (index < 0) return;
        const done = dataStage.splice(index, 1);
        this.setState({
            dataStage,
            data: data.concat(R.merge(done, result))
        }, () => {
            this.onOssChange();
        });
    }

    onOssCompleteQueue = () => {
        console.log('ItouchtvImageUploader onOssCompleteQueue');
    }

    // ------------------------------------------
    onButtonClick = () => {
        this.setState({
            visible: true
        });
    }

    onModalCancel = () => {
        this.setState({
            visible: false
        });
    }

    onOssUpload = async () => {
        await this.createComposeOssWithMime();
        this.uploadOss();
    }

    onOssChange = () => {
        const { data } = this.state;
        this.props.onDataChange && this.props.onDataChange(data?.map(v => v.sourceLink));
    }

    onTabChange = (tabKey) => {
        this.setState({
            tabKey
        });
    }

    onItemClick = (value) => {
        const { current } = this.state;
        if (R.equals(current, value)) {
            this.setState({
                current: null
            });
            return;
        }
        this.setState({
            current: value
        });
    }

    onStatusChange = (status) => {
        this.setState({
            status
        });
    }

    onCoverCrop = async () => {
        const { onChange = () => null } = this.props;
        try {
            await this.setState({
                isCropping: true
            });
            const { base64Data, value } = this.cropper.getCroppedCanvas();
            if (R.isNil(base64Data)) {
                this.setState({
                    isCropping: false
                });
                message.error('截图失败');
                return;
            }
            const res = await this.uploadBase64Oss(base64Data.toDataURL(), value);
            this.setState({
                isCropping: false,
                visible: false,
            }, () => {
                this.setState({
                    status: IMAGE_UPLOAD_STATUS.CHOOSE
                });
            });
            onChange(res?.sourceLink);
        } catch (e) {
            this.setState({
                isCropping: false
            });
            message.error('截图失败');
            console.log(e);
        }
    }

    // ------------------------------------------
    render() {
        const {
            visible, data = [], dataStage = [], current, status, isCropping, tabKey
        } = this.state;
        const {
            value, dataSource, aspectRatio, style
        } = this.props;
        const { width, height } = aspectRatio;
        console.warn('%cItouchtvImageUploader', data, dataStage, value, dataSource);

        return (
            <React.Fragment>
                <ButtonUpload
                    aspectRatio={aspectRatio}
                    style={style}
                    onClick={this.onButtonClick}
                    value={value}
                />
                <div className={styles['label-tips']}>
                    <span>最小尺寸{width}*{height}</span>
                    <span>请勿使用gif、带大量文字、卡通元素</span>
                </div>
                <Modal
                    title='选择图片'
                    visible={visible}
                    width={750}
                    onCancel={this.onModalCancel}
                    footer={<Footer
                        value={current}
                        status={status}
                        isCropping={isCropping}
                        onChange={this.onStatusChange}
                        onCancel={this.onModalCancel}
                        onOk={this.onCoverCrop}
                    />}
                >
                    {status === IMAGE_UPLOAD_STATUS.CHOOSE &&
                        <TabContainer
                            dataSource={dataSource}
                            current={current}
                            data={data}
                            tabKey={tabKey}
                            onTabChange={this.onTabChange}
                            onItemClick={this.onItemClick}
                            render={() => (
                                <React.Fragment>
                                    <Button
                                        type='dashed'
                                        onClick={this.onOssUpload}
                                        className={[styles['image-warpper'], styles.button].join(' ')}
                                    >
                                        <Icon type='plus' />
                                    </Button>
                                    {data?.map(v => (
                                        <ImageItem
                                            selected={R.equals(current, v)}
                                            key={v.key}
                                            src={v.sourceLink}
                                            onClick={() => this.onItemClick(v)}
                                        />
                                    ))}
                                    {dataStage?.map(v => <ImageItem key={v.key} />)}
                                </React.Fragment>
                            )}
                        />
                    }
                    {status === IMAGE_UPLOAD_STATUS.CROP &&
                        <Cropper
                            ref={c => { this.cropper = c; }}
                            value={current?.sourceLink || current}
                            aspectRatio={aspectRatio}
                        />
                    }
                </Modal>
            </React.Fragment>
        );
    }
}

export default ItouchtvImageUploader;
