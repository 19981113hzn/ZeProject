import React from 'react';
import { Row, Col, Typography } from 'antd';

import ImageLoad from 'Components/ImageLoad';
import { renderOverlay } from 'Components/CardBox/tools';
import { getEntity, getDetailRoute } from 'Utils/utils';

import SeriesVideoBlock from './SeriesVideo';
import TvColumnBlock from './TvColumn';
import AudioColumnBlock from './AudioColumn';
import NewsBlock from './News';
import TopicBlock from './Topic';

import styles from './index.less';

const { Paragraph } = Typography;

/** 剧集 */
export const SeriesVideo = SeriesVideoBlock;
/** 电视节目 */
export const TvColumn = TvColumnBlock;
/* 广播节目 */
export const AudioColumn = AudioColumnBlock;

/** 新闻 */
export const News = NewsBlock;
/** 专题 */
export const Topic = TopicBlock;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleRenderLink = (newsData) => {
        const { id, contentType, objectType } = newsData;
        const route = getDetailRoute({
            source: newsData,
            objectType,
            contentType,
            sid: id
        });
        return route;
    }

    /** 显示角标 */
    renderTagRb = (newsData) => renderOverlay(newsData);

    render() {
        const { source } = this.props;
        const newsData = getEntity(source);
        return (
            <a className={styles['content-element']} href={this.handleRenderLink(newsData)}>
                <Row gutter={8}>
                    <Col span={12}>
                        <div className={styles['cover-url']}>
                            <ImageLoad className={styles.cover} src={newsData.coverUrl} />
                            {this.renderTagRb(newsData)}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Paragraph className={styles.title} ellipsis={{ rows: 3 }}>{newsData.title}</Paragraph>
                    </Col>
                </Row>
            </a>
        );
    }
}
