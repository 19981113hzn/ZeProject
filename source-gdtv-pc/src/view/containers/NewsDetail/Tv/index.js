import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Row, Col } from 'antd';
import HelmetSEO from 'Components/HelmetSEO';
import VideoPlayWithAd from 'Components/VideoPlayWithAd';
import VideoSide from 'Components/VideoSide';
import CardFlow from 'Components/CardFlow';

import { NEWS_ROUTE } from 'Constants/type';
import responsiveStyles from 'Constants/style/responsive.less';
import { safeLens, urlJSON, ENTITY_KEY } from 'Utils/utils';
import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';

/**
 * PageName: 新闻详情-电视节目播放页
 *
 * Author: lishihua
 * use: [ ]
 *
 */
@connect(selectors, {
    getNewsContent: Actions.getNewsContent.request,
    getRecommendList: Actions.getRecommendList.request
})
class Tv extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        if (!this.props.isPrefetch) {
            this.initPageData();
        }
    }

    initPageData = async (sid = this.props.match.params.id) => {
        this.props.getNewsContent({ sid });
    }

    handleChangeNews = async (ele) => {
        console.log('columnVideo', ele);
        const { contentType, id } = ele;
        this.props.history.push(`/${NEWS_ROUTE[contentType]}/${id}`);
        if (contentType == 3 && this.props.match.params.id != id) {
            await this.initPageData(id);
        }
    }

    /** 视频播放结束 */
    onEnd = () => {
        console.log('end');
    }

    render() {
        const {
            newsContent, classificationName, columnVideo, moreColumnVideo
        } = this.props;

        const videoUrl = urlJSON(safeLens(newsContent, ['video', 'playUrl']));

        const helmetData = {
            title: [newsContent.title, classificationName, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsContent.keyword,
            description: newsContent.summary || classificationName,
            imgUrl: newsContent.coverUrl
        };
        return (
            <div className={[styles['tv-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['tv-content-top']}>
                    <div id={'tv-detail'} className={[responsiveStyles.content, styles['tv-detail-box']].join(' ')} >
                        <div className={responsiveStyles['video-box']}>
                            <div className={responsiveStyles['video-box-left']}>
                                {videoUrl && typeof window === 'object' &&
                                    <VideoPlayWithAd
                                        key={videoUrl}
                                        columnPk={newsContent.tvColumnPk}
                                        className={responsiveStyles.video}
                                        poster={newsContent.coverUrl}
                                        videoUrl={videoUrl}
                                        onEnd={this.onEnd}
                                    />
                                }
                            </div>
                            <div className={responsiveStyles['video-box-right']}>
                                <VideoSide
                                    title={classificationName}
                                    titleLink={`/tvColumn/${newsContent.tvColumnPk}`}
                                    sourceList={columnVideo.map((item) => item[ENTITY_KEY])}
                                    activeIndex={columnVideo.findIndex(item => item[ENTITY_KEY].id == this.props.match.params.id)}
                                    onItemClick={this.handleChangeNews}
                                />
                            </div>
                        </div>
                        <div className={styles['tv-info']}>
                            <div className={styles['tv-title']}>{newsContent.title}</div>
                            <div>{moment(newsContent.releasedAt).format('YYYY-MM-DD HH:mm')}</div>
                        </div>
                    </div>
                </div>

                {moreColumnVideo?.list?.length > 0 &&
                    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}>
                        <p className={styles['text-more']}>更多精彩</p>
                        <Row>
                            <Col span={24} type="flex">
                                <CardFlow
                                    flowData={moreColumnVideo.list}
                                    displayType={moreColumnVideo.displayType}
                                    isMulti={true}
                                    extra={{ blank: false }}
                                />
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}
export default Tv;
