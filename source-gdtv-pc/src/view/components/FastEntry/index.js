import React, { Component } from 'react';
import { Popover } from 'antd';

import { gridArray } from 'Utils/tools';
import { NEWS_ROUTE, TOPIC_ROUTE } from 'Constants/type';
import styles from './index.less';

/**
 * ModuleName: 快捷入口
 * 
 * Author: xuchunhua 
 * use: [ Header ]
 * 
 */
export default class FastEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    renderPopoverContent = () => {
        const { channelList = [] } = this.props;
        const list = gridArray(channelList, 6);
        return (
            <div className={styles.content}>
                {list.map((column, i) => (
                    <div className={styles['nav-col']} key={i}>
                        {column.map(this.renderItem)}
                    </div>
                ))}
            </div>
        );
    }

    renderItem = (item, i) => {
        const {
            objectId,
            objectType,
            contentType,
            externalUrl
        } = item;
        let link = '';
        switch (objectType) {
            case 0: // 外链
                link = externalUrl;
                break;
            case 1: // 新闻
                link = `/${NEWS_ROUTE[contentType]}/${objectId}`;
                break;
            case 2: // 频道
                if (contentType == 0) {
                    link = `/channels/${objectId}`;
                } else if (contentType == 1) {
                    link = `/channelDetail/${objectId}`;
                }
                break;
            case 3: // 专题
                link = `/${TOPIC_ROUTE[1]}/${objectId}`;
                break;
            case 4: // 电视栏目
                link = `/tvColumn/${objectId}`;
                break;
            default:
                break;
        }
        return (
            <a
                className={styles.channel}
                href={link}
                target='_blank'
                key={i}
            >
                {item.title}
            </a>
        );
    }

    render() {
        const { title } = this.props;
        return (
            <div className={styles['fast-entry']}>
                <Popover
                    placement='bottomLeft'
                    content={this.renderPopoverContent()}
                >
                    <div className={styles.title}>
                        <img src={require('../../statics/images/icon_channel.png')} />
                        <span>&nbsp;&nbsp;{title}</span>
                    </div>
                </Popover>
            </div >
        );
    }
}
