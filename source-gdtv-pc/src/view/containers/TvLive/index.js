import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import HelmetSEO from 'Components/HelmetSEO';
import VideoPlay from 'Components/VideoPlay';
import CardFlow from 'Components/CardFlow';
import ImageLoad from 'Components/ImageLoad';
import moment from 'moment';

import responsiveStyles from 'Constants/style/responsive.less';
import { colSpan } from 'Constants/antProps';

import { urlJSON, ENTITY_TYPE } from 'Utils/utils';
import * as GlobalActions from 'Global/actions';
import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';

/**
 * PageName: 看电视直播
 *
 * Author: lishihua
 * use: [ ]
 *
*/
@connect(selectors, {
    incrReadCount: GlobalActions.incrReadCount.request,
    getTvChannelDetail: Actions.getTvChannelDetail.request,
    getTvChannelList: Actions.getTvChannelList.request,
    getTvMenuList: Actions.getTvMenuList.request,
    getTvColumn: Actions.getTvColumn.request,
})
class TvLive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 当前播放id
            playingId: 0,
            // 直播中id
            livingId: 0,
            // 今天
            today: moment().format('YYYY-MM-DD'),
            currentIndex: 0,
            currentVideoIndex: 0,
            endAt: moment().add(3, 'days').format('YYYY-MM-DD'),
            beginAt: moment().subtract(6, 'days').format('YYYY-MM-DD'),

            // 时移
            timeShift: ''
        };
        this.timeout = [];
        this.errorCount = 30;
    }

    static prefetch = prefetchSaga;

    componentDidMount = async () => {
        if (!this.props.isPrefetch) {
            this.props.getTvChannelDetail({ // 获取电视频道详情
                tvChannelPk: this.props.match.params.id
            });
            this.props.getTvChannelList({ category: 0 }); // 获取电视频道列表

            await new Promise((resolve, reject) => {
                this.props.getTvMenuList({ // 获取电视节目菜单
                    tvChannelPk: this.props.match.params.id,
                    beginAt: this.state.beginAt,
                    endAt: this.state.endAt,
                }, resolve, reject);
            });
            this.props.getTvColumn({ // 获取更多精彩
                tvChannelPk: this.props.match.params.id
            });
        }
        const { today } = this.state;
        const currentIndex = this.props.dateLiveMenu.findIndex(item => today == item.dateAt);
        this.setState({ currentIndex });
        this.handleSetLiving();
        const t = setTimeout(() => {
            // 日期定位到今天
            this.handleChangeDate(currentIndex);
            // 定位正在播放的位置
            this.handleScrollTop();
        }, 500);
        this.timeout.push(t);
    }

    componentWillUnmount() {
        if (this.timeout) {
            this.timeout.forEach((t) => {
                clearTimeout(t);
            });
        }
    }

    // 定时设置直播中标签
    handleSetLiving = () => {
        const { allMenuList } = this.props;
        const currentTime = moment().valueOf();
        const [livingItem] = allMenuList.filter(item => item.beginAt <= currentTime && currentTime < item.endAt);
        if (livingItem) {
            this.setState({ livingId: livingItem.pk });

            const t = setTimeout(() => {
                this.handleSetLiving();
            }, livingItem.endAt - currentTime + 1000);
            this.timeout.push(t);

            this.props.incrReadCount({
                columnPk: livingItem.tvColumnPk,
                contentType: 3,
                tvMenuId: livingItem.pk
            });
        }
    }

    // 直播中
    handleLookingLive = () => {
        const { livingId, playingId } = this.state;
        if (livingId == playingId) {
            return;
        }
        this.setState({ timeShift: '', playingId: livingId });
        this.errorCount = 30;
    }

    // 回看
    handleLookingBack = (item) => {
        const { playingId } = this.state;
        if (item.pk == playingId) {
            return;
        }

        console.log(item, this.props);
        const beginAt = `lhs_start_unix_ms_0=${item.beginAt}`;
        const endAt = `lhs_vodend_unix_ms_0=${item.endAt}`;
        const timeShift = `&aliyunols=on&${beginAt}&${endAt}`;
        this.setState({ timeShift, playingId: item.pk });
        this.errorCount = 30;
        this.props.incrReadCount({
            columnPk: item.tvColumnPk,
            contentType: 3,
            tvMenuId: item.pk,
        });
    }

    // 播放下一段回看
    handlePlayNext = () => {
        const { allMenuList } = this.props;
        const { livingId, playingId } = this.state;
        // 正在观看直播
        if (livingId == playingId) {
            return;
        }
        const index = allMenuList.findIndex(item => item.pk == playingId);
        const nextVideo = allMenuList[index + 1];
        // 下一段视频正在直播中
        if (nextVideo.pk == livingId) {
            this.setState({ timeShift: '', playingId: livingId });
            this.errorCount = 30;
        } else {
            this.handleLookingBack(nextVideo);
        }
    }

    // 切换日期列表
    handleChangeDate(index, type) {
        const { dateLiveMenu } = this.props;
        if (index == 0 && type == 'pre' || index == dateLiveMenu.length - 1 && type == 'next') {
            return;
        }
        const nexIndex = type == 'next' ? index + 1 : index - 1;
        this.setState({
            currentIndex: type ? nexIndex : index
        });
        const current = type ? this.refs[`nav${nexIndex}`] : this.refs[`nav${index}`];
        this.scrollToView(current);
        // 日期切换时，始终保持节目清单滚动位置为0，或者为正在播放的清单位置
        setTimeout(() => {
            this.handleScrollTop();
        }, 100);
    }

    // 定位正在播放的位置
    handleScrollTop = () => {
        if (this.refs.scrollBox) {
            if (this.refs.playingItem) {
                this.refs.scrollBox.scrollTop(this.refs.playingItem.offsetTop);
            } else if (this.refs.livingItem) {
                this.refs.scrollBox.scrollTop(this.refs.livingItem.offsetTop);
            } else {
                this.refs.scrollBox.scrollTop(0);
            }
        }
    }

    // 滚动效果
    scrollToView(el) {
        if (!el) {
            return;
        }
        const parent = this.refs.parentBox;
        // console.log(el.offsetLeft, parent.offsetWidth, parent);
        const p = (el.offsetLeft - parent.scrollLeft - 88);
        // console.log(p);
        if (el.offsetLeft > 0) {
            parent.scrollLeft += p;
            return;
        }
        parent.scrollLeft = 0;
    }

    // 切换频道（选集）
    renderChannelLink = (ele) => `/tvChannelDetail/${ele.pk}`;

    // 解析链接
    renderLink = (channelNews) => `/tvColumnVideo/${channelNews.pk}`;

    // 直播流播放异常 -> 定时重新获取播放地址
    handleOnPlayError = () => {
        if (this.errorCount <= 0) return;
        this.errorCount -= 1;
        console.log(this.errorCount);
        const t = setTimeout(() => {
            this.props.getTvChannelDetail({ // 获取电视频道详情
                tvChannelPk: this.props.match.params.id
            });
        }, 10 * 1000);
        this.timeout.push(t);
    }

    render() {
        const {
            tvChannelDetail, tvChannelList, tvColumn, dateLiveMenu
        } = this.props;
        const {
            livingId, playingId, today, currentIndex, timeShift
        } = this.state;

        const currentTime = moment().valueOf();
        const currentChannel = this.props.match.params.id;

        const helmetData = {
            title: [tvChannelDetail.name, '荔枝网'].filter(Boolean).join('-'),
            keywords: tvChannelDetail.keyword,
            description: tvChannelDetail.slogan,
            imgUrl: tvChannelDetail.coverUrl
        };
        return (
            <div className={[styles['tv-channel-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['tv-channel-content-top']}>
                    <div className={[styles['tv-channel-detail-box'], responsiveStyles.content].join(' ')} >
                        <div className={responsiveStyles['video-box']}>
                            <div className={responsiveStyles['video-box-left']}>
                                {typeof window == 'object' && tvChannelDetail.playUrl &&
                                    <VideoPlay
                                        className={[responsiveStyles.video, styles.video].join(' ')}
                                        poster={tvChannelDetail.coverUrl}
                                        videoUrl={tvChannelDetail.playUrl + timeShift}
                                        onEnd={this.handlePlayNext}
                                        onError={this.handleOnPlayError}
                                        noHistory={true}
                                    />
                                }
                            </div>
                            <div className={[responsiveStyles['video-box-right'], styles['channel-live-box']].join(' ')} >
                                <div className={styles['fix-position']}>
                                    {/* 电视详情 */}
                                    <div className={styles['channel-summery']}>
                                        <span className={styles['head-img']}>
                                            <ImageLoad src={tvChannelDetail.avatarUrl} />
                                        </span>
                                        <div className={styles['summery-text']}>
                                            <p>{tvChannelDetail.name}</p>
                                            <p>{tvChannelDetail.slogan}</p>
                                        </div>
                                    </div>
                                    {/* 节目单时间 */}
                                    <div style={{ position: 'relative' }}>
                                        <span
                                            className={[
                                                styles['switch-btn-L'],
                                                currentIndex == 0 && styles.disabled
                                            ].join(' ')}
                                            onClick={() => this.handleChangeDate(currentIndex, 'pre')}
                                        />
                                        <span
                                            className={[
                                                styles['switch-btn-R'],
                                                currentIndex == dateLiveMenu.length - 1 && styles.disabled
                                            ].join(' ')}
                                            onClick={() => this.handleChangeDate(currentIndex, 'next')}
                                        />
                                        <div className={styles['date-list']} id='parent-box' ref="parentBox">
                                            <ul>
                                                {dateLiveMenu.map((item, i) => (
                                                    <li
                                                        id={`nav-${i}`}
                                                        ref={`nav${i}`}
                                                        onClick={() => this.handleChangeDate(i)}
                                                        className={currentIndex == i && styles['curr-style'] || ''}
                                                        key={`nav-${i}`}
                                                    >
                                                        {item.dateAt == today &&
                                                            <div className={styles['text-day']} style={{ fontSize: '14px' }}>
                                                                今日
                                                            </div>
                                                        }
                                                        {item.dateAt != today &&
                                                            <div>
                                                                <div className={styles['text-day']}>
                                                                    {item.weekDay}
                                                                </div>
                                                                <div className={styles['text-time']}>
                                                                    {item.dateAt}
                                                                </div>
                                                            </div>
                                                        }
                                                        {currentIndex == i &&
                                                            <span className={styles['position-line']}></span>
                                                        }
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <Scrollbars
                                    className={styles['live-list']}
                                    ref='scrollBox'
                                    autoHide={true}
                                    autoHideTimeout={500}
                                >
                                    {dateLiveMenu[currentIndex]?.tvMenus?.length > 0
                                        ? dateLiveMenu[currentIndex].tvMenus.map(ele => (
                                            <div
                                                className={[
                                                    styles['live-item'],
                                                    currentTime < ele.beginAt && styles.disabled || ''
                                                ].join(' ')}
                                                ref={livingId == ele.pk && 'livingItem' || playingId == ele.pk && 'playingItem' || ''}
                                                key={ele.pk}
                                            >
                                                <div className={styles.time}>{moment(ele.beginAt).format('HH:mm')}</div>
                                                <div className={styles.title}>{ele.name}</div>
                                                <div className={styles.suffix}>
                                                    {livingId == ele.pk &&
                                                        <div
                                                            className={[styles.tag, styles.playing].join(' ')}
                                                            onClick={this.handleLookingLive}
                                                        >
                                                            直播中
                                                        </div>
                                                    }
                                                    {tvChannelDetail.timeOffset == 1 &&
                                                        livingId != ele.pk &&
                                                        currentTime > ele.endAt &&
                                                        <div
                                                            className={[styles.tag, playingId == ele.pk && styles.playing].join(' ')}
                                                            onClick={() => { this.handleLookingBack(ele); }}
                                                        >
                                                            {playingId == ele.pk ? '回看中' : '回看'}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                        : <div className={styles['none-data']}>暂无数据</div>
                                    }
                                </Scrollbars>
                            </div>
                        </div>
                        {/* 节目列表 */}
                        <Row className={styles['channel-list']} gutter={24}>
                            {tvChannelList.map((ele, i) => (
                                <Col {...colSpan} key={i}>
                                    <a
                                        className={[
                                            styles['tag-channel'],
                                            currentChannel == ele.pk && styles['current-channel']
                                        ].join(' ')}
                                        href={this.renderChannelLink(ele)}
                                    >
                                        {ele.name}
                                    </a>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
                {/* 精彩回顾 */}
                {tvColumn && tvColumn.length > 0 &&
                    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}>
                        <p className={styles['text-more']}>精彩回顾</p>
                        <CardFlow
                            flowData={tvColumn}
                            displayType={0}
                            isMulti={true}
                            extra={{
                                entityType: ENTITY_TYPE.DATA_JSON,
                                customLink: this.renderLink
                            }}
                        />
                    </div>
                }
            </div >
        );
    }
}

export default TvLive;
