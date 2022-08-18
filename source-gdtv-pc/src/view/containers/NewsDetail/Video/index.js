import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import moment from 'moment';

import HelmetSEO from 'Components/HelmetSEO';
import VideoPlay from 'Components/VideoPlay';
import VideoSide from 'Components/VideoSide';
import CardFlow from 'Components/CardFlow';

import responsiveStyles from 'Constants/style/responsive.less';
import {
    safeLens, urlJSON, getDetailRoute, ENTITY_TYPE
} from 'Utils/utils';
import { NO_RELATIVE_ID } from 'Constants/hardCode';

import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';

/**
 * PageName: 视频播放详情页
 * 
 * Author: lishihua 
 * use: [ ]
 * 
*/
@connect(selectors, {
    getNewsContent: Actions.getNewsContent.request,
    getRecommendList: Actions.getRecommendList.request,
})
class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getNewsContent({
                sid: this.props.match.params.id
            });
        }
    }

    handleChangeNews = (ele) => {
        const { newsContent } = this.props;
        const { id, objectType, contentType } = ele;
        const route = getDetailRoute({
            source: ele,
            objectType,
            contentType,
            sid: id,
            channelId: newsContent.channelPK
        });
        this.props.history.push(route);
        switch (`${objectType}`) {
            case '0':
                if (contentType == 1 && this.props.match.params.id != id) {
                    this.props.getNewsContent({
                        sid: id
                    });
                }
                break;
            default:
                break;
        }
    }

    /** 视频播放结束 */
    onEnd = () => {
        console.log('end');
    }


    render() {
        const {
            channelInfo = {},
            newsContent,
            classificationName,
            recommendNews,
            moreRecommendNews
        } = this.props;
        const videoUrl = urlJSON(safeLens(newsContent, ['video', 'playUrl']));

        const helmetData = {
            title: [newsContent.title, channelInfo.name, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsContent.keyword,
            description: newsContent.summary || channelInfo.name,
            imgUrl: newsContent.coverUrl
        };

        const filterRecommendNews = recommendNews.filter(item => NO_RELATIVE_ID.includes(newsContent.id) && item.id == newsContent.id || !NO_RELATIVE_ID.includes(newsContent.id));
        return (
            <div className={[styles['video-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['video-content-top']}>
                    <div id={'video-detail'} className={[styles['video-detail-box'], responsiveStyles.content].join(' ')} >
                        <div className={responsiveStyles['video-box']}>
                            <div className={responsiveStyles['video-box-left']}>
                                {videoUrl && typeof window === 'object' &&
                                    <VideoPlay
                                        className={responsiveStyles.video}
                                        poster={newsContent.coverUrl}
                                        videoUrl={videoUrl}
                                        onEnd={this.onEnd}
                                    />
                                }
                            </div>
                            <div className={responsiveStyles['video-box-right']} >
                                <VideoSide
                                    title={classificationName}
                                    sourceList={filterRecommendNews}
                                    activeIndex={filterRecommendNews.findIndex(item => item.id == this.props.match.params.id)}
                                    onItemClick={this.handleChangeNews}
                                />
                            </div>
                        </div>
                        <div className={styles['video-info']}>
                            <div className={styles['video-title']}>{newsContent.title}</div>
                            <div>{moment(newsContent.releasedAt).format('YYYY-MM-DD HH:mm')}</div>
                        </div>
                    </div>
                </div>

                {moreRecommendNews?.list?.length > 0 &&
                    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}>
                        <p className={styles['text-more']}>更多精彩</p>
                        <Row>
                            <Col span={24} type="flex">
                                <CardFlow
                                    flowData={moreRecommendNews.list}
                                    displayType={moreRecommendNews.displayType}
                                    isMulti={true}
                                    extra={{
                                        entityType: ENTITY_TYPE.DATA_JSON,
                                        channelId: this.props.newsContent?.channelPK,
                                        blank: false
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}
export default Video;
