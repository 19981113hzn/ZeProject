/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs,Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import responsiveStyles from 'Constants/style/responsive.less';
import { timeFromNow } from 'Utils/utils';

import HelmetSEO from 'Components/HelmetSEO';
import VideoPlay from 'Components/VideoPlay';

import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';
import CountDown from 'Components/CountDown'

// 直播状态
const LIVE_STATUS = {
    5: '直播预告',
    6: '直播中',
    7: '直播暂停',
    8: '直播结束',
    9: '回顾'
};
/**
 * PageName: 视频播放详情页
 *
 * Author: lishihua
 * use: [ ]
 *
*/

@connect(selectors, {
    getLive: Actions.getLive.request,
    getRecentlyLive: Actions.getRecentlyLive.request,
    getMediaLive: Actions.getMediaLive.request,
    getLiveContent: Actions.getLiveContent.request
})
class LiveRoom extends Component {
    constructor(props) {
        super(props);

        this.scrollRef = React.createRef()

        this.titleRef = []

        this.state = {
            show: [],
            currentTitleRefHeights: [],
            currentTab: "ANCHOR_HALL"
        };
    }

    static prefetch = prefetchSaga;

    static getDerivedStateFromProps (props, state) {
        const { liveContent } = props;
        return {
             ...state,
             titleRef: liveContent.map(_ => React.createRef())
        }
   }

    async componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getLive({
                id: this.props.match.params.id
            });
            this.props.getRecentlyLive()
            this.props.getMediaLive({mediaLivePk: this.props.match.params.id})

            await this.handleFetchLiveContent()

            if (this.props.liveContent.length === 0) {
                this.setState({
                    currentTab: "MORE"
                })
            }

            this.timer = setInterval(async () => {
                // this.scrollRef.current.scrollToBottom()
                await this.handleFetchLiveContent(0)
            }, 500)
        }
    }

    comoponentWillUnMount() {
        this.timer && clearInterval(this.timer)
    }

    handleFetchLiveContent = async (lastScore = this.props.liveScore) => {
        await new Promise((resolve, reject) => {
            this.props.getLiveContent({
                liveId: this.props.match.params.id,
                lastScore,
                pageSize: 20
            },resolve,reject)
        })

        if (this.state.titleRef){
            const titleRefHeights = this.state.titleRef.map(item => {
                return item.current.offsetHeight
            })
            this.setState({
                currentTitleRefHeights: titleRefHeights
            })
        }
    }
    
    handleChangeTab = (key) => {
        this.setState({ currentTab: key });
    }

    /** 视频播放结束 */
    onEnd = () => {
        console.log('end');
    }

    handleGetPlayUrl = () => {
        const { status, playUrl = {} } = this.props.liveDetail;
        const {
            rtmp, flv, m3u8, mp4
        } = playUrl;
        switch (`${status}`) {
            case '6':
                return m3u8 || flv || rtmp;
            case '9':
                return mp4;
            default:
                return undefined;
        }
    }

    handleScrollFrame = ({ top }) => {
        if (top === 1) {
            // 到达底部
            this.handleFetchLiveContent()
        }
    }

    toggleShow = (index) => {
        const show = this.state.show;
        show.indexOf(index) === -1 ? show.push(index): show.splice(show.indexOf(index), 1);
        this.setState({
            show
        })
    }

    render() {
        const {
            liveDetail,
            moreLive,
            liveContent,
        } = this.props;

        const { currentTab, show, currentTitleRefHeights } = this.state;

        const { status, beginAt } = liveDetail;

        const { responseList } = moreLive;
        const playUrl = this.handleGetPlayUrl();

        const debounce = require('lodash.debounce');

        const helmetData = {
            title: [liveDetail.title, '荔枝网'].filter(Boolean).join('-'),
            keywords: liveDetail.keyword,
            description: liveDetail.desc,
            imgUrl: liveDetail.coverUrl
        };

        return (
            <div className={[styles['video-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={styles['video-content-warpper']}>
                    <div id={'video-detail'} className={[styles['video-detail-box'], responsiveStyles.content].join(' ')} >
                        <div className={responsiveStyles['video-box']}>
                            <div className={responsiveStyles['video-box-left']} style={{
                                backgroundImage: `url('${liveDetail.coverUrl}')`,
                                backgroundSize: '100% 100%'
                            }}>
                                {([6, 9].includes(status)) && playUrl && typeof window === 'object' &&
                                    <VideoPlay
                                        className={responsiveStyles.video}
                                        poster={liveDetail.coverUrl}
                                        videoUrl={playUrl}
                                        onEnd={this.onEnd}
                                    />
                                }
                                {
                                    status == 5 && beginAt && <CountDown startTime={beginAt} className={styles['count-down']} />
                                }
                                {
                                    status == 8  && <span className={styles['live-over-tips']}>直播已结束</span>
                                }
                            </div>
                            <div className={styles['relative-video-box']} >
                                <div className={styles['fix-position']}>
                                    <h3>{liveDetail.title}</h3>
                                    <div className={styles['live-info-wrap']}>
                                        {/*{liveDetail.fromSource && <div className={styles['live-fromSource']}>{ liveDetail.fromSource }</div>}*/}
                                        <div className={styles['live-time']}>{ new Date(liveDetail.beginAt).toLocaleString() }</div>
                                    </div>

                                    {
                                        [5, 6, 9].includes(status) && (
                                            <Tabs activeKey={currentTab} className={styles['moreFun']} onChange={this.handleChangeTab}>
                                                {liveContent.length != 0 && <Tabs.TabPane tab="主播厅" key="ANCHOR_HALL"></Tabs.TabPane>}
                                                <Tabs.TabPane tab="更多精彩" key="MORE"></Tabs.TabPane>
                                            </Tabs>
                                        )
                                    }
                                </div>
                                {/* 主播厅 */}
                                {
                                    (currentTab === "ANCHOR_HALL") && (
                                        <Scrollbars
                                            ref={this.scrollRef}
                                            className={styles['anchorHall-list-wrap']}
                                            autoHide={true}
                                            onScrollFrame={debounce(this.handleScrollFrame)}
                                            autoHideTimeout={500}
                                            >
                                            {
                                                liveContent && liveContent.map((item,index) => {
                                                    const flag = this.state.show.indexOf(index) === -1;
                                                    return (
                                                        <div key={item.id} className={styles['anchorHall-list-item']}>
                                                            <div className={styles['anchorHall-title']}>
                                                                <div>
                                                                    {item.presenter}
                                                                    {item.isTop > 0 && <p className={styles['moreLive-list-isTop']}>（置顶）</p>}
                                                                </div>
                                                                <small>{timeFromNow(item.sendAt)}</small>
                                                            </div>
                                                            <div ref={this.state.titleRef[index]} className={styles[(currentTitleRefHeights[index] >= 300) && flag ? 'show' : void 0]}>
                                                                <div className={styles['anchorHall-content']}>
                                                                    {item.content}
                                                                </div>
                                                                {
                                                                    item.images.map(url => (
                                                                        <img src={url} className={styles['morelive-list-picture']}/>
                                                                    ))
                                                                }
                                                            </div>
                                                            {
                                                                currentTitleRefHeights[index] >= 300 ? 
                                                                (
                                                                    flag 
                                                                    ? (
                                                                        <a key={index} className={styles['shrink']} onClick={() => this.toggleShow(index)}>
                                                                            展开<Icon type="down" style={{marginLeft: '5px'}} />
                                                                        </a>
                                                                    ) 
                                                                    : (
                                                                        <a key={index} className={styles['shrink']} onClick={() => this.toggleShow(index)}>
                                                                            收起<Icon type="up" style={{marginLeft: '5px'}} />
                                                                        </a>
                                                                    )
                                                                )
                                                                :void 0
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Scrollbars>
                                    )
                                }
                                {/* 更多精彩 */}
                                {
                                    (currentTab === 'MORE') && (
                                        <Scrollbars
                                            className={styles['moreLive-list-wrap']}
                                            autoHide={false}
                                            autoHideTimeout={500}
		                                >
                                            {responseList && responseList.map((item) => {
                                                    let sta = item.status;
                                                    return (
                                                        <a href={'/live/' + item.id} key={item.id}>
                                                            <div
                                                                key={item.id}
                                                                className={styles['moreLive-list-item']}
                                                            >
                                                                <div className={styles['moreLive-list-img']}>
                                                                    <img src={item.coverUrl} />
                                                                </div>
                                                                <div className={styles['moreLive-list-flowIcon']}>
                                                                    {sta == 5
                                                                        ? '直播预告'
                                                                        : sta == 6
                                                                        ? '直播中'
                                                                        : sta == 7
                                                                        ? '直播暂停'
                                                                        : sta == 8
                                                                        ? '直播结束'
                                                                        : sta == 9
                                                                        ? '回顾'
                                                                        : ''}
                                                                </div>
                                                                <div className={styles['moreLive-list-title']}>
                                                                    {item.title}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
		                                </Scrollbars>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LiveRoom;
