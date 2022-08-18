import React from 'react';
import { Icon } from 'antd';

import ImageLoad from 'Components/ImageLoad';

import styles from './index.less';

export default class ImageItem extends React.PureComponent {
    render() {
        const { src, onClick = () => null, selected } = this.props;
        return (
            <div
                onClick={onClick}
                className={[
                    styles['image-container'],
                    styles.img,
                    styles[selected && 'selected' || '']
                ].join(' ')}
            >
                {selected &&
                    <div className={styles.masked}>
                        <Icon className={styles['icon-check']} type='check' />
                    </div>
                }
                <ImageLoad
                    src={src}
                    render={({ isFailed, isLoaded, query }) => {
                        if (isFailed) {
                            return <i className={styles['icon-transcode-error']} />;
                        }
                        if (!isLoaded) {
                            return <i className={styles['icon-transcode']} />;
                        }

                        return <img src={src + query} />;
                    }}
                />
            </div>
        );
    }
}
