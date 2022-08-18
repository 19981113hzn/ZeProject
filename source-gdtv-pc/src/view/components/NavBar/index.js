import React from 'react';
import { Row, Col } from 'antd';

import { gridArray } from 'Utils/tools';

import { NEWS_ROUTE, TOPIC_ROUTE } from 'Constants/type';
import responsiveStyles from 'Constants/style/responsive.less';
import styles from './index.less';
import { menu } from './constants';

/**
 * ModuleName: NavBar 导航栏
 *
 * use: [ 用于首页的导航 ]
 *
 */
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
            size: 0
        };
    }

    handleOpenMore = (e) => {
        e.stopPropagation();
        this.setState({ showMore: true });
    }

    handleCloseMore = () => {
        this.setState({ showMore: false });
    }

    handleComposeChannels = () => {
        const size = this.getSize();
        const { channelList = [] } = this.props;
        let col = 0;
        if (channelList.length > size) {
            col = size / 2;
        } else {
            col = channelList.length / 2;
        }
        return gridArray(channelList, col || 0);
    }

    getSize = () => {
        const { screenSize } = this.props;
        switch (screenSize) {
            case 'xs':
                return 8;
            case 'xl':
                return 12;
            default:
                return 16;
        }
    }

    renderNavChannel = (item, j) => {
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
                if (+contentType === 0) {
                    link = `/channels/${objectId}`;
                } else if (+contentType === 1) {
                    link = `/channelDetail/${objectId}`;
                }
                break;
            case 3: // 专题
                link = `/${TOPIC_ROUTE[1]}/${objectId}`;
                break;
            case 4: // 电视栏目
                link = `/tvColumn/${objectId}`;
                break;
            case 5:
                link = `/audioColumn/${objectId}`;
                break;
            default:
                break;
        }
        return (
            <a
                className={styles['nav-bar-channel']}
                href={link}
                target='_blank'
                key={`${j}-${item.title}`}
            >
                {item.title}
            </a>
        );
    }

    render() {
        const size = this.getSize();
        const { showMore } = this.state;
        const { channelList = [] } = this.props;
        const channelListLength = channelList.length;
        const composeChannels = this.handleComposeChannels();
        return (
            <div className={[styles['nav-bar-container'], responsiveStyles.layout].join(' ')}>
                <div className={[styles['nav-bar'], responsiveStyles.content].join(' ')}>
                    <Row onClick={this.handleCloseMore}>
                        <Col span={16}>
                            <div
                                className={[styles['nav-bar-channel-list'], showMore && styles['open-more']].join(' ')}
                                onMouseLeave={this.handleCloseMore}
                                tabIndex='0'
                                hidefocus='true'
                            >
                                {composeChannels.map((channels, i) => (
                                    <div className={styles['nav-bar-channel-group']} key={i}>
                                        {channels.map((item, j) => (
                                            (!showMore && channelListLength > size && i + 1 === size / 2 && j === 1) &&
                                            <div
                                                className={styles['nav-bar-channel']}
                                                onMouseOver={this.handleOpenMore}
                                                key={`${j}-更多`}
                                            >
                                                <a><div>更多&gt;&gt;</div></a>
                                            </div>
                                            || this.renderNavChannel(item, j)
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col span={8}>
                            <Row className={styles['nav-bar-icon-list']} gutter={16} type='flex' justify='end'>
                                {menu.map((item, j) => (
                                    <Col span={6} key={j}>
                                        <a key={j}
                                            className={styles['nav-bar-icon']}
                                            href={item.url}
                                            target={item.newBlank ? '_blank' : ''}
                                        >
                                            <div className={[styles['nav-bar-icon-cover'], item.className].join(' ')} />
                                            <span className={styles['nav-bar-icon-title']}>{item.name}</span>
                                        </a>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
