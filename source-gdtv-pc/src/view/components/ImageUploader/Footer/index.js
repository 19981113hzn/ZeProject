import React from 'react';
import { Button } from 'antd';

import { IMAGE_UPLOAD_STATUS } from '../constants';

export default class Footer extends React.PureComponent {
    render() {
        const {
            status,
            value,
            isCropping,
            onCancel,
            onOk,
            onChange,
        } = this.props;
        switch (status) {
            case IMAGE_UPLOAD_STATUS.CHOOSE:
                return (
                    <React.Fragment>
                        <Button
                            type='primary'
                            disabled={!value}
                            onClick={() => onChange(IMAGE_UPLOAD_STATUS.CROP)}
                        >
                            下一步
                        </Button>
                        <Button onClick={onCancel}>取消</Button>
                    </React.Fragment>
                );
            case IMAGE_UPLOAD_STATUS.CROP:
                return (
                    <React.Fragment>
                        <Button onClick={() => onChange(IMAGE_UPLOAD_STATUS.CHOOSE)} type='primary'>
                            上一步
                        </Button>
                        <Button
                            key={isCropping ? 'loading' : 'loaded'}
                            loading={isCropping}
                            onClick={onOk}
                            type='primary'
                        >
                            确定
                        </Button>
                        <Button onClick={onCancel}>取消</Button>
                    </React.Fragment>
                );
            default:
                return null;
        }
    }
}
