import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import HelmetSEO from 'Components/HelmetSEO';
import AudioPlay from 'Components/AudioPlay';
import ImageLoad from 'Components/ImageLoad';
import moment from 'moment';

import responsiveStyles from 'Constants/style/responsive.less';

import Swiper from 'swiper';
import { message } from 'antd';
import * as GlobalActions from 'Global/actions';
import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';

const debounce = require('lodash.debounce');

@connect(selectors, {
    incrReadCount: GlobalActions.incrReadCount.request,
    getTvChannelDetail: Actions.getTvChannelDetail.request,
    getTvChannelList: Actions.getTvChannelList.request,
    getTvMenuList: Actions.getTvMenuList.request,
    getTvColumn: Actions.getTvColumn.request,
})
class AudioLive extends Component {
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
            videoUrl: '',

            // 时移
            timeShift: ''
        };
        this.timeout = [];
    }

    static prefetch = prefetchSaga;

    componentDidMount = async () => {
        if (!this.props.isPrefetch) {
            this.props.getTvChannelDetail({ // 获取电视频道详情
                tvChannelPk: this.props.match.params.id
            });

            await new Promise((resolve, reject) => {
                this.props.getTvChannelList({ category: 1 }, resolve, reject); // 获取电视频道列表
            });

            await new Promise((resolve, reject) => {
                this.props.getTvMenuList({ // 获取电视节目菜单
                    tvChannelPk: this.props.match.params.id,
                    beginAt: this.state.beginAt,
                    endAt: this.state.endAt,
                }, resolve, reject);
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

        this.swiper = new Swiper('.swiper-container', {
            loop: false,
            observer: true,
            direction: 'horizontal',
            speed: 0,
            centeredSlides: true,
            centeredSlidesBounds: true,
            spaceBetween: 30,
            slidesPerView: 3, // 设置slider容器能够同时显示的slides数量(carousel模式)。另外，支持'auto'值，会根据容器container的宽度调整slides数目。
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 250,
                modifier: 1,
                slideShadows: true,
            },
            effect: 'coverflow',
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                slideChange: this.slideChange,
                click: this.slideClick
            },
        });

        const tvChannelPk = +this.props.match.params.id;
        const initialSlide = Math.max(0, this.props.tvChannelList.findIndex(item => item.pk == tvChannelPk));
        if (this.swiper) this.swiper.slideTo(initialSlide);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (+prevProps.match.params.id !== +this.props.match.params.id) {
            const tvChannelPk = this.props.match.params.id;
            await new Promise((resolve, reject) => {
                this.props.getTvChannelDetail({ // 获取电视频道详情
                    tvChannelPk
                }, resolve, reject);
            });
            await new Promise((resolve, reject) => {
                this.props.getTvMenuList({ // 获取电视节目菜单
                    tvChannelPk,
                    beginAt: this.state.beginAt,
                    endAt: this.state.endAt,
                }, resolve, reject);
            });

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
                contentType: 6,
                tvMenuId: livingItem.pk
            });
        }
    }

    // 切换频道
    slideChange = debounce(() => {
        if (+this.props.match.params.id !== this.props.tvChannelList[this.swiper.activeIndex].pk) {
            this.props.history.push(`/audioChannelDetail/${this.props.tvChannelList[this.swiper.activeIndex].pk}`);
        }
    }, 200);

    slideClick = debounce((e) => {
        console.log(this.swiper, e);
    }, 500)

    // 直播中
    handleLookingLive = () => {
        const { livingId, playingId } = this.state;
        if (livingId == playingId) {
            return;
        }
        this.setState({ videoUrl: this.props.tvChannelDetail.playUrl, playingId: livingId });
    }

    // 回看
    handleLookingBack = (item) => {
        console.log(item);
        this.setState({
            playingId: item.sid
        });

        item.pk && this.props.incrReadCount({
            columnPk: item.tvColumnPk,
            contentType: 6,
            tvMenuId: item.pk
        });

        if (item.playBackUrl && JSON.parse(item.playBackUrl)?.hd) {
            window.open(`/audio/${item.sid}`, '_blank');
        } else {
            message.error('未生成回顾');
        }
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

    formatPlayTime = (time) => {
        let hour = parseInt((time) / 3600, 10);
        if (hour < 10) {
            hour = '0' + hour;
        }
        let minute = parseInt((time % 3600) / 60, 10);
        if (minute < 10) {
            minute = '0' + minute;
        }
        let second = Math.ceil(time % 60);
        if (second < 10) {
            second = '0' + second;
        }
        return (hour ? (hour + ':') : '') + minute + ':' + second;
    };

    // 切换频道（选集）
    renderChannelLink = (ele) => `/audioChannelDetail/${ele.pk}`;

    // 解析链接
    // renderLink = (channelNews) => `/audioColumnVideo/${channelNews.pk}`;

    render() {
        const {
            tvChannelDetail, tvChannelList, dateLiveMenu
        } = this.props;

        const {
            livingId, playingId, today, currentIndex,
            isLiving = true,
            videoUrl
        } = this.state;

        const playUrl = videoUrl || tvChannelDetail.playUrl;
        // 'https://win-web-nf01-sycdn.kuwo.cn/982788db82391619094f1a5536117fa3/61236d2a/resource/n3/58/72/1818456574.mp3'

        const currentMenuName = dateLiveMenu
            .reduce((list, cur) => {
                list = list.concat(cur.tvMenus || []);
                return list;
            }, [])
            .find(item => item.pk === (playingId || livingId))?.name;

        const currentTime = moment().valueOf();

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
                        {/* 频道列表 */}
                        <div style={{ position: 'relative' }} className={styles['tv-channel-wrapper']}>
                            <div className={['swiper-container', styles['channel-list']].join(' ')}>
                                <div className={'swiper-wrapper'}>
                                    {tvChannelList.map((ele, i) => (
                                        <div className={'swiper-slide'} style={{ borderRadius: 6, overflow: 'hidden' }}>
                                            <ImageLoad src={ele.avatarUrl} key={i}/>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="swiper-button-prev"/>
                            <div className="swiper-button-next"/>
                        </div>


                        {/* 播放器 */}
                        <div className={styles['video-box-right']}>
                            {typeof window == 'object' && tvChannelDetail.playUrl &&
                            <AudioPlay
                                isLiving={isLiving}
                                className={[responsiveStyles.video, styles.video].join(' ')}
                                logoUrl={tvChannelDetail.avatarUrl}
                                videoUrl={playUrl}
                                title={tvChannelDetail.name}
                                slogan={currentMenuName}
                                onEnd={this.handlePlayNext}
                                onError={() => null}
                                noHistory={true}
                            />
                            }
                        </div>
                    </div>
                </div>

                <div className={[responsiveStyles['video-box-bottom'], responsiveStyles.content, styles['channel-live-box']].join(' ')} >
                    <div className={styles['channel-menu']}>
                        {/* 广播详情 */}
                        <div className={styles['channel-summery']}>
                            <span className={styles['head-img']}>
                                <ImageLoad src={tvChannelDetail.avatarUrl} />
                            </span>
                            <div className={styles['summery-text']}>
                                <h3>{tvChannelDetail.name}</h3>
                                <p>{tvChannelDetail.slogan}</p>
                            </div>
                        </div>
                        {/* 节目单时间 */}
                        <div className={styles['channel-timeline']}>
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
                                            {currentIndex == i && <span className={styles['position-line']}/>}
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
                            ? dateLiveMenu[currentIndex].tvMenus.map((ele, i) => (
                                <div
                                    className={[
                                        styles['live-item'],
                                        [playingId, livingId].includes(ele.pk) ? styles['is-living'] : '',
                                        currentTime > ele.endAt && styles.disabled || ''
                                    ].join(' ')}
                                    ref={livingId == ele.pk && 'livingItem' || playingId == ele.pk && 'playingItem' || ''}
                                    key={i}
                                >
                                    <div className={styles.time}>{moment(ele.beginAt).format('HH:mm')}-{moment(ele.endAt).format('HH:mm')}</div>
                                    <a disabled={currentTime < ele.beginAt} href={`/audioColumn/${ele.tvColumnPk}`} target='_blank'>
                                        <div className={styles.title}>{ele.name}</div>
                                    </a>
                                    <div className={styles.anchor}>主播：{ele.anchor}</div>
                                    <div className={styles.duration}>时长：{this.formatPlayTime((ele.endAt - ele.beginAt) / 1000)}</div>
                                    <div className={styles.suffix}>
                                        {livingId == ele.pk &&
                                            <div
                                                className={[styles.tag, styles.playing].join(' ')}
                                                onClick={this.handleLookingLive}>
                                                直播中
                                            </div>
                                        }
                                        {currentTime > ele.endAt &&
                                             <div
                                                 className={[styles.tag].join(' ')}
                                                 onClick={() => { this.handleLookingBack(ele); }}
                                             >
                                                 回顾
                                                 {/* {playingId == ele.pk ? '回顾中' : '回顾'} */}
                                             </div>}
                                    </div>
                                </div>
                            ))
                            : <div className={styles['none-data']}>暂无数据</div>
                        }
                    </Scrollbars>
                </div>


                {/* 精彩回顾 */}
                {/* {tvColumn && tvColumn.length > 0 && */}
                {/*    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}> */}
                {/*        <p className={styles['text-more']}>精彩回顾</p> */}
                {/*        <CardFlow */}
                {/*            flowData={tvColumn} */}
                {/*            displayType={0} */}
                {/*            isMulti={true} */}
                {/*            extra={{ */}
                {/*                entityType: ENTITY_TYPE.DATA_JSON, */}
                {/*                customLink: this.renderLink */}
                {/*            }} */}
                {/*        /> */}
                {/*    </div> */}
                {/* } */}
            </div >
        );
    }
}

export default AudioLive;
