import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Icon } from 'antd';
import * as R from 'ramda';

import {
    safeLens, urlJSON, urlParams, getDetailRoute
} from 'Utils/utils';
import CardFlow from 'Components/CardFlow';
import HelmetSEO from 'Components/HelmetSEO';

import responsiveStyles from 'Constants/style/responsive.less';

import VideoPlay from 'Components/VideoPlay';

import * as GlobalActions from 'Global/actions';
import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';

const PAGE_SIZE = 30;

/**
 * PageName: 专题剧集播放详情页
 * 
 * Author: lishihua 
 * use: [ ]
 * 
 */
@connect(selectors, {
    addNewsCount: GlobalActions.addNewsCount.request,
    getNewsTopic: Actions.getNewsTopic.request,
    getNewsTopicMemberList: Actions.getNewsTopicMemberList.request,
    getChannelNewsList: Actions.getChannelNewsList.request
})
class SeriesVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            currentVideoIndex: 0,
            currentVideoDetail: {}
        };
    }

    static prefetch = prefetchSaga;

    componentDidMount = async () => {
        const { params } = this.props.match;
        if (!this.props.isPrefetch) {
            this.props.getNewsTopic({
                topicId: params.id
            });
            await new Promise((resolve, reject) => {
                this.props.getNewsTopicMemberList({
                    topicId: params.id
                }, resolve, reject);
            });

            const { channelId } = urlParams();
            if (channelId) {
                this.props.getChannelNewsList({
                    channelId,
                    beginScore: 0,
                    pageSize: 7
                });
            }
        }
        this.handleInitSeries();
    }

    shouldComponentUpdate(nextProps, nextState) {
        /** 选集切换时记录浏览量 */
        const oldDetail = this.state.currentVideoDetail;
        const nextDetail = nextState.currentVideoDetail;
        if (oldDetail && nextDetail && oldDetail.id != nextDetail.id) {
            this.props.addNewsCount({
                id: nextState.currentVideoDetail.id,
                countType: 'readCount'
            });
        }
        return true;
    }

    /** 
     * 初始化播放
     * episodeId [支持选集播放]
     */
    handleInitSeries = () => {
        const { videoId } = urlParams();
        let episodeId = 1;
        if (videoId) {
            const { topicMemberList } = this.props;
            episodeId = topicMemberList.findIndex(_ => _.id == videoId) + 1;
        } else {
            const { params } = this.props.match;
            episodeId = params.episodeId || 1;
        }
        const { newsTopicMemberList = [], total } = this.props;
        if (episodeId > total) {
            episodeId = 1;
        }
        const section = Math.ceil(episodeId / PAGE_SIZE - 1);
        const sectionList = newsTopicMemberList[section];
        const i = episodeId % PAGE_SIZE - 1;
        this.handleChangeSeries(section);
        this.handleChangeVideo(sectionList[i], episodeId - 1);
    }

    /** 滚动效果 */
    scrollToView = (el) => {
        if (!el) {
            return;
        }
        console.log('to');
        const parent = document.getElementById('parent-box');
        const p = (el.offsetLeft - 130);
        console.log(p);
        if (p > 0) {
            parent.scrollLeft = p;
            return;
        }
        parent.scrollLeft = 0;
    }

    /**
     * 切换选集分段列表
     * @param {*} index 
     */
    handleChangeSeries = (index) => {
        this.setState({
            currentIndex: index, // 当前的选集分段位置
        });
        const current = document.getElementById(`nav-${index}`);
        this.scrollToView(current);
    }

    /**
     * 
     * 切换播放视频（选集）
     */
    handleChangeVideo = (ele = {}, index) => {
        const { channelId } = urlParams();
        const { params } = this.props.match;
        this.setState({
            currentVideoIndex: index,
            currentVideoDetail: ele
        }, () => {
            const path = getDetailRoute({
                objectType: 1,
                contentType: 0,
                sid: params.id,
                episodeId: index + 1,
                channelId
            });
            this.props.history.replace(path);
        });
    }

    render() {
        const { currentVideoDetail } = this.state;
        const {
            newsTopicDetail = {}, newsTopicMemberList = [], channelNewsList = []
        } = this.props;
        const { currentIndex, currentVideoIndex } = this.state;
        const videoUrl = urlJSON(safeLens(currentVideoDetail, ['videoUrl']));

        const helmetData = {
            title: [newsTopicDetail.title, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsTopicDetail.keywords,
            description: newsTopicDetail.summary,
            imgUrl: newsTopicDetail.coverUrl
        };
        return (
            <div className={[styles['series-video-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['video-content-top']}>
                    <div className={[styles['video-detail-box'], responsiveStyles.content].join(' ')} >
                        <div className={[responsiveStyles['video-box'], styles['video-box']].join(' ')} >
                            <div className={responsiveStyles['video-box-left']}>
                                {videoUrl &&
                                    <VideoPlay
                                        className={responsiveStyles.video}
                                        poster={currentVideoDetail?.coverUrl}
                                        videoUrl={videoUrl}
                                    />
                                }
                            </div>
                            <div className={[responsiveStyles['video-box-right'], styles['selections-box']].join(' ')} >
                                <h3>{newsTopicDetail.title}</h3>
                                <p className={styles['selections-count']}>
                                    {R.flatten(newsTopicMemberList).length >= newsTopicDetail.memberNum
                                        ? `${newsTopicDetail.memberNum}集全`
                                        : `已更新至第${R.flatten(newsTopicMemberList).length}集`
                                    }
                                </p>
                                {/* 选集分段 */}
                                <div className={styles['list-box']} id='parent-box'>
                                    <ul key={1}>
                                        {newsTopicMemberList.map((ele, index) => (
                                            <li
                                                id={`nav-${index}`}
                                                key={index}
                                                onClick={() => this.handleChangeSeries(index)}
                                                className={currentIndex == index && styles['curr-style'] || ''}
                                            >
                                                {`${index > 0 ? index * PAGE_SIZE + 1 : 1}
                                                -
                                                ${index * PAGE_SIZE + (ele.length < PAGE_SIZE ? ele.length : 30)}`}
                                                {currentIndex == index &&
                                                    <span className={styles['position-line']}></span>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* 选集 */}
                                <ul style={{ marginLeft: 4 }} key={2}>
                                    {newsTopicMemberList && newsTopicMemberList[currentIndex]?.map((ele, i) => {
                                        const index = currentIndex * PAGE_SIZE + i;
                                        return (
                                            <li
                                                className={styles['number-box']}
                                                key={i}
                                                style={{
                                                    backgroundColor: currentVideoIndex == index ? 'rgba(0,0,0,1)' : ''
                                                }}
                                            >
                                                {currentVideoIndex != index &&
                                                    <div
                                                        className={styles['text-box']}
                                                        onClick={() => this.handleChangeVideo(ele, index)}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                }
                                                {currentVideoIndex == index &&
                                                    <div className={styles['icon-box']}>
                                                        <Icon type='caret-left' theme='filled' style={{ color: '#F12D37' }} />
                                                    </div>
                                                }
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className={styles['video-title']}>
                            {currentVideoDetail && currentVideoDetail.title || newsTopicDetail.summary}
                        </div>
                    </div>
                </div>

                {channelNewsList?.length > 0 &&
                    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}>
                        <p className={styles['text-more']}>更多精彩</p>
                        <CardFlow
                            flowData={channelNewsList}
                            displayType={1}
                            isMulti={true}
                            extra={{ blank: false }}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default SeriesVideo;
