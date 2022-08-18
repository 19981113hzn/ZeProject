import React, { Component } from 'react';
import moment from 'moment';
import {
    Row, Col, Button, Typography
} from 'antd';
import ImageLoad from 'Components/ImageLoad';
import { getDetailRoute } from 'Utils/utils';

import styles from './index.less';

const { Paragraph } = Typography;

/**
 * 电视节目展示模块
 */
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getSize = () => {
        const { screenSize } = this.props;
        switch (screenSize) {
            case 'xs':
                return 3;
            default:
                return 4;
        }
    }

    handleOnExpand = () => { this.setState({ isExpand: true }); }

    handleCloseExpand = () => { this.setState({ isExpand: false }); }

    /** 跳转电视节目某集 */
    handleToTvColumnDetail = (news) => {
        const { id, contentType } = news;
        const route = getDetailRoute({
            source: news,
            objectType: 0,
            contentType,
            sid: id
        });
        window.open(route);
    }

    renderNewsList = () => {
        const { source } = this.props;
        const maxSize = this.getSize();
        const { length } = source.newsList || [];
        return (
            <Row className={styles['news-list']} gutter={10}>
                {source.newsList?.map((news, i) => (length > maxSize && i < maxSize - 1 || length <= maxSize) && (
                    <Col {...{ xs: 8, xl: 6, xxl: 6 }} key={i}>
                        <Button
                            className={styles['btn-news']}
                            onClick={() => { this.handleToTvColumnDetail(news); }}
                            block
                        >
                            {moment(news.releasedAt).format('YYYY-MM-DD')}期 {news.title}
                        </Button>
                    </Col>
                ))}
                {length > maxSize &&
                    <Col {...{ xs: 8, xl: 6, xxl: 6 }}>
                        <a href={`/tvColumn/${source.pk}`} target='_blank'>
                            <Button className={styles['btn-news']} block>更多</Button>
                        </a>
                    </Col>
                }
            </Row>
        );
    }

    render() {
        const { isExpand } = this.state;
        const { source } = this.props;

        const updatedAt = source && source.newsList && source.newsList.length ? source.newsList[0].releasedAt : source.updatedAt;

        return (
            <div className={styles['el-tv-column']}>
                <div className={styles['cover-box']}>
                    <a href={`/tvColumn/${source.pk}`} target='_blank'>
                        <ImageLoad src={source.coverUrl} />
                    </a>
                </div>
                <div className={styles.detail} >
                    <h2>
                        <a href={`/tvColumn/${source.pk}`} target='_blank'>
                            <div dangerouslySetInnerHTML={{ __html: source.name }}></div>
                        </a>
                    </h2>
                    <div className={styles.from}>
                        <div>最近更新：<span>{moment(updatedAt).format('YYYY-MM-DD')}</span></div>
                        {source.tvChannelName &&
                            <div>来源：<span>{source.tvChannelName}</span></div>
                        }
                    </div>
                    <div className={styles.desc}>
                        <b>简介</b>
                        {!isExpand &&
                            <Paragraph
                                className={styles['desc-text']}
                                ellipsis={{ rows: 1, expandable: true, onExpand: this.handleOnExpand }}
                            >
                                {source.desc || '暂无简介'}
                            </Paragraph>
                        }
                        {isExpand &&
                            <div className={styles['desc-text']} onMouseLeave={this.handleCloseExpand}>
                                {source.desc || '暂无简介'}
                            </div>
                        }
                    </div>
                    {!isExpand && this.renderNewsList()}
                </div>
            </div>
        );
    }
}
