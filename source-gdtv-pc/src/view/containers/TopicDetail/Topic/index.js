import React, { Component } from 'react';
import { connect } from 'react-redux';
import HelmetSEO from 'Components/HelmetSEO';
import VideoPlay from 'Components/VideoPlay';
import VideoSide from 'Components/VideoSide';
import CardFlow from 'Components/CardFlow';

import { ENTITY_TYPE } from 'Utils/utils';
import responsiveStyles from 'Constants/style/responsive.less';

import * as GlobalActions from 'Global/actions';
import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';
import { getScreenRange } from '../../../utils/tools';

/**
 * PageName: 专题播放详情页
 * Author: xuchunhua
 * use: [ ]
 * 背景图，描述，视频播放都可能没有
 */
@connect(selectors, {
    addNewsCount: GlobalActions.addNewsCount.request,
    getNewsTopic: Actions.getNewsTopic.request,
    getNewsTopicColumn: Actions.getNewsTopicColumn.request,
    getNewsTopicMemberListV2: Actions.getNewsTopicMemberListV2.request
})
class Topic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 当前播放的视频栏目
            columnWithPlay: {},
            // 当前播放的视频
            currentVideo: {},
            // 查看全部
            showAll: {},
            // 当前播放的视频所在列表下标
            activeIndex: 0,
            // topicIndex 专题index
            topicIndex: 0,
            topicList: []
        };
    }

    static prefetch = prefetchSaga;

    componentDidMount = async () => {
        const { id } = this.props.match.params;
        if (!this.props.isPrefetch) {
            this.props.getNewsTopic({ topicId: id });
            await this.getNewTopicByPage({ topicId: id });
        }
        const { newsTopicColumn } = this.props;
        const [columnWithPlay] = newsTopicColumn.filter((item) => item.type == 3);
        const [currentVideo = {}] = columnWithPlay?.memberList || [];
        this.setState({ currentVideo, columnWithPlay, activeIndex: 0 });
    }

    shouldComponentUpdate(nextProps, nextState) {
        /** 切换视频时记录浏览量 */
        const oldDetail = this.state.currentVideo;
        const nextDetail = nextState.currentVideo;
        if (oldDetail && nextDetail && oldDetail.id != nextDetail.id) {
            this.props.addNewsCount({
                id: nextState.currentVideo.id,
                countType: 'readCount'
            });
        }
        return true;
    }

    getSize = () => {
        const screenRange = getScreenRange();
        const screenSize = Object.keys(screenRange).find(_ => screenRange[_]);
        switch (screenSize) {
            case 'xs':
                return 8;
            case 'xl':
                return 12;
            default:
                return 14;
        }
    }

    /** 右侧栏切换视频 */
    handleChangeVideo = (data, i) => {
        const { currentVideo } = this.state;
        if (currentVideo.id == data.id) {
            return;
        }
        this.setState({ currentVideo: data, activeIndex: i });
    }

    /** 解析视频地址 */
    handleAnalysisVideoUrl = () => {
        const { currentVideo } = this.state;
        const { videoUrl } = currentVideo;
        try {
            const { sd, hd, ud } = JSON.parse(videoUrl);
            return ud || hd || sd;
        } catch (error) {
            return undefined;
        }
    }

    handlePlayEnd = () => {
        const { columnWithPlay, currentVideo } = this.state;
        const index = columnWithPlay?.memberList?.findIndex(_ => _.id == currentVideo.id);
        const nextIndex = columnWithPlay?.memberList?.length == index + 1 ? 0 : index + 1;
        this.setState({ currentVideo: columnWithPlay?.memberList[nextIndex] });
    }

    // 获取专题
    getNewTopicByPage = async (query) => {
        await new Promise((resolve, reject) => {
            this.props.getNewsTopicColumn({
                ...query,
                beginScore: 0,
                pageSize: this.getSize()
            }, resolve, reject);
        });
    }

    /** 查看更多 */
    handleShowMoreTopic = async (column) => {
        const requestObj = {
            beginScore: column.lastScore || 0,
            topicId: column.id,
            pageSize: this.getSize()
        };

        await new Promise((resolve, reject) => {
            this.props.getNewsTopicMemberListV2({
                ...requestObj
            }, resolve, reject);
        });
    }

    render() {
        const {
            columnWithPlay,
            currentVideo,
            activeIndex
        } = this.state;
        const {
            newsTopicDetail,
            newsTopicColumn
        } = this.props;
        const videoUrl = this.handleAnalysisVideoUrl();
        const helmetData = {
            title: [newsTopicDetail.title, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsTopicDetail.keywords,
            description: newsTopicDetail.summary,
            imgUrl: newsTopicDetail.coverUrl
        };
        return (
            <div className={[responsiveStyles.layout, styles.topic].join(' ')}>
                <HelmetSEO {...helmetData} />
                {newsTopicDetail.backgroundUrl &&
                    <img className={styles['topic-bg']} src={newsTopicDetail.backgroundUrl} />
                }
                <div className={[responsiveStyles.content, styles.content].join(' ')} >
                    {newsTopicDetail.summary &&
                        <div className={styles.summary}>{newsTopicDetail.summary}</div>
                    }
                    {columnWithPlay?.memberList?.length > 0 &&
                        <div className={[responsiveStyles['video-box'], styles['video-box']].join(' ')}>
                            <div className={responsiveStyles['video-box-left']}>
                                <div className={responsiveStyles.video}></div>
                                {videoUrl &&
                                    <VideoPlay
                                        className={responsiveStyles.video}
                                        poster={currentVideo.coverUrl}
                                        videoUrl={videoUrl}
                                        title={currentVideo.title}
                                        onEnd={this.handlePlayEnd}
                                    />
                                }
                            </div>
                            <div className={responsiveStyles['video-box-right']}>
                                <VideoSide
                                    title={columnWithPlay.title}
                                    sourceList={columnWithPlay.memberList}
                                    activeIndex={activeIndex}
                                    onItemClick={this.handleChangeVideo}
                                />
                            </div>
                        </div>
                    }
                    <div className={styles['topic-column-list']}>
                        {newsTopicColumn?.map((column, i) => column.id != columnWithPlay?.id && (
                            <div className={styles['topic-column']} key={i}>
                                {(!columnWithPlay || newsTopicColumn.length > 1) &&
                                    <h3>{column.title}</h3>
                                }
                                <CardFlow
                                    flowData={column.memberList}
                                    displayType={0}
                                    isMulti={true}
                                    extra={{
                                        entityType: ENTITY_TYPE.DATA_JSON,
                                    }}
                                />
                                {
                                    !column.isDone && <div
                                        className={styles['btn-show-more']}
                                        onClick={() => { this.handleShowMoreTopic(column); }}
                                    >
                                        查看更多
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Topic;
