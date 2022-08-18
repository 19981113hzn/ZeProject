import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

import { AD_TV_COLUMN_LIST } from 'Constants/hardCode';
import responsiveStyles from 'Constants/style/responsive.less';
import { urlJSON, safeLens, ENTITY_KEY } from 'Utils/utils';

import HelmetSEO from 'Components/HelmetSEO';
import VideoPlayWithAd from 'Components/VideoPlayWithAd';
import VideoSide from 'Components/VideoSide';
import CardFlow from 'Components/CardFlow';

import * as GlobalActions from 'Global/actions';
import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';

/**
 * PageName: 电视栏目拆条回顾
 * 通过电视栏目pk获取播放列表
 * Author: lishihua
 * use: [ ]
 *
*/
@connect(selectors, {
    addNewsCount: GlobalActions.addNewsCount.request,
    getColumnVideoList: Actions.getColumnVideoList.request,
    setVideoDetail: Actions.setVideoDetail
})
class TvColumnVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoDetail: {}
        };
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getColumnVideoList({
                tvColumnPk: this.props.match.params.id,
                // beginScore: this.props.beginScore
                beginScore: 0,
                pageSize: 10
            });
        }
    }

    shouldComponentUpdate(nextProps) {
        /** 选集切换时记录浏览量 */
        const oldDetail = this.props.videoDetail;
        const nextDetail = nextProps.videoDetail;
        if (oldDetail && nextDetail && oldDetail.id != nextDetail.id) {
            this.props.addNewsCount({
                id: nextProps.videoDetail.id,
                countType: 'readCount'
            });
        }
        return true;
    }

    handleChangeNews = (item) => {
        this.props.setVideoDetail(item);
    }

    render() {
        const {
            columnVideoList, relateNews, videoDetail, nameText
        } = this.props;
        const videoUrl = urlJSON(safeLens(videoDetail, ['videoUrl']));
        const helmetData = {
            title: [videoDetail.title, nameText, '荔枝网'].filter(Boolean).join('-'),
            description: nameText,
            imgUrl: videoDetail.coverUrl
        };
        return (
            <div className={[styles['column-video-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['video-content-top']}>
                    <div id={'video-detail'} className={[styles['video-detail-box'], responsiveStyles.content].join(' ')} >
                        <div className={responsiveStyles['video-box']}>
                            <div className={responsiveStyles['video-box-left']}>
                                {videoUrl && typeof window === 'object' &&
                                    <VideoPlayWithAd
                                        key={videoUrl}
                                        className={responsiveStyles.video}
                                        poster={videoDetail.coverUrl}
                                        videoUrl={videoUrl}
                                        columnPk={this.props.match.params?.id}
                                    />
                                }
                            </div>
                            <div className={[responsiveStyles['video-box-right'], styles['relative-video-box']].join(' ')}>
                                <VideoSide
                                    title={nameText || videoDetail.title}
                                    titleLink={`/tvColumn/${this.props.match.params.id}`}
                                    sourceList={columnVideoList.map((item) => item[ENTITY_KEY])}
                                    activeIndex={columnVideoList.findIndex(item => item[ENTITY_KEY].id == videoDetail.id)}
                                    onItemClick={this.handleChangeNews}
                                />
                            </div>
                        </div>
                        <div className={styles['video-title']}>{videoDetail.title || videoDetail.preSubTitle}</div>
                    </div>
                </div>
                {relateNews && relateNews.length > 0 &&
                    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}>
                        <p className={styles['text-more']}>更多精彩</p>
                        <Row>
                            <Col span={24} type="flex">
                                <CardFlow
                                    flowData={relateNews}
                                    displayType={0}
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

export default TvColumnVideo;
