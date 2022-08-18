import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { getLocal } from 'Utils/localDataUtils';

import responsiveStyles from 'Constants/style/responsive.less';
import styles from './index.less';

const colSpan = {
    xs: 24, xl: 8, xxl: 8
};

const ICON_CLASS = [
    styles['icon-tv'],
    styles['icon-radio'],
    styles['icon-network']
];

/**
 * ModuleName: 友情链接
 * 
 * use: [ 信息流友情链接模块 ]
 * 
*/
class FriendLinks extends Component {
    render() {
        const { friendlyLinks = {} } = this.props;
        const { textFriendlyLinkResponse = [] } = friendlyLinks;
        return (
            <div className={styles['friendly-links-container']}>
                <div className={styles['friendly-links']}>
                    <Row gutter={24} type='flex'>
                        {textFriendlyLinkResponse &&
                            textFriendlyLinkResponse.map(({ name, friendlyLinkResponse = [] }, i) => (
                                <Col {...colSpan} key={i}>
                                    <div className={styles['friendly-links-module']}>
                                        <div className={[styles.title, ICON_CLASS[i]].join(' ')}>
                                            {name}
                                        </div>
                                        <div className={styles.links}>
                                            {friendlyLinkResponse.map((link, j) => (
                                                <a href={link.linkUrl} target='_blank' key={j}>{link.name}</a>
                                            ))}
                                        </div>
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                </div>
            </div>
        );
    }
}

export default FriendLinks;
