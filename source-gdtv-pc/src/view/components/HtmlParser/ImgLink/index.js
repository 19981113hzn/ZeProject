import React from 'react';
import { Icon } from 'antd';

import styles from './index.less';

/**
 * 
 */
class ImgLink extends React.Component {
    constructor(props) {
        super(props);

        this.timer = null;
        this.id = null;

        this.state = {
        };
    }

    render() {
        const { outLink, imgSrc } = this.props;

        return (
            <section className={styles['img-link-section']}>
                <a className={styles['insert-link']} href={outLink} target='_blank' data-link-type='image'>
                    <div className={styles['img-warpper']}>
                        <img src={imgSrc} crossOrigin='anonymous' />
                        <div className={styles.href}>
                            <Icon type='link' />网页链接
                        </div>
                    </div>
                </a>
            </section>
        );
    }
}

export default ImgLink;
