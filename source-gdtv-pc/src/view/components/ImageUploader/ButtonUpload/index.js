import React from 'react';
import { Button, Icon } from 'antd';

import styles from './index.less';

export default class ButtonUpload extends React.PureComponent {
    render() {
        const {
            onClick, aspectRatio: aspectRatioRaw, value, style
        } = this.props;
        const { width, height } = aspectRatioRaw;
        const aspectRatio = {
            width: 286,
            height: 286 * height / width
        };
        return !value
            ? (
                <Button
                    onClick={onClick}
                    type={'dashed'}
                    className={styles['button-up']}
                    style={{ ...aspectRatio, ...style }}
                >
                    <Icon className={styles.icon} type='plus' />
                    <p className={styles.label}>上传图片</p>
                </Button>
            ) : (
                <div
                    className={styles['button-img']}
                    style={{ ...aspectRatio, ...style, backgroundImage: `url('${value}')` }}
                    onClick={onClick}
                >
                    <div className={styles['change-img']}>
                        <span>更换图片</span>
                    </div>
                </div>
            );
    }
}
