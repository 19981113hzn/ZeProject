import React, { Component } from 'react';
import { getChannelAliasById, getChannelName } from 'Utils/utils';
import { getLocal } from 'Utils/localDataUtils';

import styles from './index.less';

/**
 * ModuleName: 详情页面包屑
 * 
 * Author: zhuhuishao 
 * use: [ SEO siteMap 辅助导航 ]
 * 
*/
class BreadCrumb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fixed: false
        };
    }

    render() {
        const { newsContent } = this.props;
        const { thisNews = {}, channelId: sid } = newsContent;
        const navList = getLocal('channels') ? getLocal('channels') : { all: [] };
        const articleTitle = thisNews.title;

        let channelName;

        if (getChannelName(sid, navList.all)) {
            channelName = getChannelName(sid, navList.all);
        }

        if (sid) {
            return (
                <div className={styles['bread-crumb-wrap']}>
                    <a className={styles['nav-link']} href='/'>首页</a>
                    {channelName && <a className={styles['nav-link']} href={getChannelAliasById(sid, navList.all)}>{channelName}</a>}
                    <span className={styles['nav-span']}>{articleTitle}</span>
                </div>
            );
        }

        return null;
    }
}

export default BreadCrumb;
