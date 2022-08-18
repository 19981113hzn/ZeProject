import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { message, Typography } from 'antd';
import HelmetSEO from 'Components/HelmetSEO';

import { NEWS_ROUTE } from 'Constants/type';
import responsiveStyles from 'Constants/style/responsive.less';
import { safeLens, urlJSON, calVideoTime } from 'Utils/utils';

import { Scrollbars } from 'react-custom-scrollbars';
import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';
import AudioPlay from '../../../components/AudioPlay';
import ImageLoad from '../../../components/ImageLoad';

const { Paragraph } = Typography;

/**
 * PageName: 新闻详情-广播节目播放页
 *
 * Author: laichangrong
 * use: [ ]
 *
 */
@connect(selectors, {
    getNewsContent: Actions.getNewsContent.request,
    getRecommendList: Actions.getRecommendList.request,
    getColumnInfo: Actions.getColumnInfo.request
})
class Audio extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static prefetch = prefetchSaga;

    async componentDidMount() {
        if (!this.props.isPrefetch) {
            await new Promise((resolve, reject) => {
                this.props.getNewsContent({
                    sid: this.props.match.params.id
                }, resolve, reject);
            });
            if (this.props.newsContent.tvColumnPk) {
                this.props.getColumnInfo({
                    columnPk: this.props.newsContent.tvColumnPk
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { id: prevId } = prevProps.match.params;
        const { id } = this.props.match.params;
        if (prevId !== id) {
            this.props.getNewsContent({
                sid: id
            });
        }
    }

    handleChangeNews = (ele) => {
        console.log('columnVideo', ele);
        const { contentType, id } = ele;
        this.props.history.push(`/${NEWS_ROUTE[contentType]}/${id}`);
        if (contentType == 3 && this.props.match.params.id != id) {
            this.props.getNewsContent({ sid: id });
        }
    }

    /** 播放下一首 */
    handlePlayNext = (item) => {
        if (item) this.props.history.push(`/audio/${item.id}`);
        else message.info('没有下一节目');
    }

    /** 播放上一首 */
    handlePlayPrev = (item) => {
        if (item) this.props.history.push(`/audio/${item.id}`);
        else message.info('没有上一节目');
    }

    routeToColumn = () => {
        const pk = this.props.newsContent.tvColumnPk;
        this.props.history.push(`/audioColumn/${pk}`);
    }

    render() {
        const {
            newsContent, classificationName, columnInfo, moreColumnVideo, columnVideo,
            match: {
                params = {}
            }
        } = this.props;
        const { isExpand } = this.state;
        const videoUrl = urlJSON(safeLens(newsContent, ['video', 'playUrl']));

        console.log(params);

        const _moreColumnVideo = {
            list: [...columnVideo, ...(moreColumnVideo?.list || [])]
        };

        // 计算出下一个节目的index
        const { id: currentId } = params;
        const prevId = _moreColumnVideo?.list.findIndex(item => item.id === params.id) - 1;
        const nextId = _moreColumnVideo?.list.findIndex(item => item.id === params.id) + 1;

        const helmetData = {
            title: [newsContent.title, classificationName, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsContent.keyword,
            description: newsContent.summary || classificationName,
            imgUrl: newsContent.coverUrl
        };
        return (
            <div className={[styles['audio-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['audio-content-top']}>
                    <div className={[responsiveStyles.content, styles['audio-detail-box']].join(' ')}>
                        {/* 节目详情介绍 */}
                        <div className={[styles.info].join(' ')}>
                            {columnInfo.coverUrl &&
                            <div className={styles.cover}>
                                <ImageLoad src={columnInfo.coverUrl} />
                            </div>
                            }
                            <div className={styles.detail}>
                                <h2>{columnInfo.name}</h2>
                                <div className={styles.from}>
                                    <div>最近更新：<span>{moment(columnInfo.updateAt).format('YYYY-MM-DD')}</span></div>
                                    {columnInfo.source && <div>所属栏目：<a style={{ color: '#fff' }} onClick={this.routeToColumn}>{newsContent.title}</a></div>}
                                </div>
                                <div className={styles.desc}>
                                    <p>简介</p>
                                    {!isExpand &&
                                    <Paragraph ellipsis={{ rows: 3, expandable: true, onExpand: this.handleOnExpand }}>
                                        {columnInfo.desc || '暂无简介'}
                                    </Paragraph>
                                    }
                                    {isExpand &&
                                    <div className={styles['desc-text']} onMouseLeave={this.handleCloseExpand}>
                                        {columnInfo.desc || '暂无简介'}
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* 播放器 */}
                        <div className={styles['video-box-right']}>
                            {typeof window == 'object' && videoUrl &&
                                <AudioPlay
                                    isReview={true}
                                    className={[responsiveStyles.video, styles.video].join(' ')}
                                    logoUrl={newsContent.coverUrl}
                                    videoUrl={videoUrl}
                                    title={newsContent.title}
                                    slogan={newsContent.slogan}
                                    onPlayNext={_ => this.handlePlayNext(_moreColumnVideo?.list[nextId])}
                                    onPlayPrev={_ => this.handlePlayPrev(_moreColumnVideo?.list[prevId])}
                                    onEnd={_ => this.handlePlayNext(_moreColumnVideo?.list[nextId])}
                                    onError={() => null}
                                    noHistory={true}
                                />
                            }
                        </div>
                    </div>
                </div>

                <h3 className={[responsiveStyles.content, styles['audio-title']].join(' ')}>更多节目</h3>
                {!!_moreColumnVideo?.list?.length && <div className={[responsiveStyles.content, styles['audio-list']].join(' ')}>
                    <Scrollbars
                        ref='scrollBox'
                        autoHide={true}
                        autoHideTimeout={500}
                        onScroll={this.onScroll}
                    >
                        {_moreColumnVideo?.list?.map((item, i) => <div className={[styles['audio-item'], item.id === currentId ? styles['is-playing'] : ''].join(' ')} key={i}>
                            <div className={styles['audio-item-time']}>{moment(item.dataJSON.releasedAt).format('YYYY-MM-DD')}</div>
                            {/* <div className={styles['audio-item-time']}>{moment(item.dataJSON.releasedAt).format('HH:mm')}-{moment(item.dataJSON.releasedAt + item.dataJSON.timeLength * 1000).format('HH:mm')}</div> */}
                            <div className={styles['audio-item-name']}>{item.dataJSON.title}</div>
                            <div className={styles['audio-item-user']}>主播：{item.dataJSON.author}</div>
                            <div className={styles['audio-item-duration']}>时长：{calVideoTime(item.dataJSON.timeLength)}</div>
                            <div className={styles['audio-item-op']}>
                                {item.id === currentId && <div
                                    className={[styles['is-reviewing']].join(' ')}
                                    onClick={this.handleLookingLive}>
                                    回顾中
                                </div>}
                                {item.id !== currentId && <a onClick={() => { this.props.history.push(`/audio/${item.id}`); }}>播放</a>}
                            </div>
                        </div>)}
                    </Scrollbars>
                </div>}
                {!_moreColumnVideo?.list?.length && <div className={[responsiveStyles.content, styles['audio-item']].join(' ')}>
                    <span style={{ color: '#999' }}>当前时间段暂无节目内容，换个时间试试看~</span>
                </div>
                }
            </div>
        );
    }
}
export default Audio;
