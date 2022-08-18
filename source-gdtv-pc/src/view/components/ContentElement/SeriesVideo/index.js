import React, { Component } from 'react';
import {
    Row, Col, Button, Typography, Tag
} from 'antd';
import ImageLoad from 'Components/ImageLoad';
import { TOPIC_ROUTE } from 'Constants/type';

import styles from './index.less';

const { Paragraph } = Typography;

/**
 * 剧集展示模块
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
                return 24;
            default:
                return 36;
        }
    }

    handleOnExpand = () => { this.setState({ isExpand: true }); }

    handleCloseExpand = () => { this.setState({ isExpand: false }); }

    handleToSeriesVideoDetail = (news, i) => {
        const { source } = this.props;
        window.open(`/${TOPIC_ROUTE[0]}/${source.id}/${i + 1}`);
    }

    renderNewsList = () => {
        const { source } = this.props;
        const maxSize = this.getSize();
        const { length } = source.newsList || [];
        return (
            <Row className={styles['news-list']} gutter={10}>
                {source.newsList?.map((news, i) => (length > maxSize && i < maxSize - 1 || length <= maxSize) && (
                    <Col {...{ xs: 3, xl: 2, xxl: 2 }} key={i}>
                        <Button
                            className={styles['btn-news']}
                            onClick={() => { this.handleToSeriesVideoDetail(news, i); }}
                            block
                        >
                            {i + 1}
                        </Button>
                    </Col>
                ))}
                {length > maxSize &&
                    <Col {...{ xs: 3, xl: 2, xxl: 2 }}>
                        <a href={`/${TOPIC_ROUTE[0]}/${source.id}`} target='_blank'>
                            <Button className={styles['btn-news']} block>…</Button>
                        </a>
                    </Col>
                }
            </Row>
        );
    }

    render() {
        const { isExpand } = this.state;
        const { source } = this.props;
        return (
            <div className={styles['el-series-video']}>
                <div className={styles['cover-box']}>
                    <a href={`/${TOPIC_ROUTE[0]}/${source.id}`} target='_blank'>
                        <ImageLoad src={source.coverUrl} />
                    </a>
                </div>
                <div className={styles.detail} >
                    <h2>
                        <a href={`/${TOPIC_ROUTE[0]}/${source.id}`} target='_blank'>
                            <div dangerouslySetInnerHTML={{ __html: source.title }}></div>
                        </a>
                        <Tag>剧集</Tag>
                    </h2>
                    <div className={styles.from}>
                        全{source.memberNum || 0}集 已更新至第{source.newsList?.length || 0}集
                    </div>
                    <div className={styles.desc}>
                        <h4>简介</h4>
                        {!isExpand &&
                            <Paragraph ellipsis={{ rows: 2, expandable: true, onExpand: this.handleOnExpand }}>
                                {source.summary || '暂无简介'}
                            </Paragraph>
                        }
                        {isExpand &&
                            <div className={styles['desc-text']} onMouseLeave={this.handleCloseExpand}>
                                {source.summary || '暂无简介'}
                            </div>
                        }
                    </div>
                    {!isExpand && this.renderNewsList()}
                </div>
            </div>
        );
    }
}
