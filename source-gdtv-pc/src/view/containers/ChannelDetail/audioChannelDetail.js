import React from 'react';
import moment from 'moment';
import {
    Button, message, Spin, Typography
} from 'antd';
import MonthRadioWithYear from 'Components/MonthRadioWithYear';
import { Scrollbars } from 'react-custom-scrollbars';
import ImageLoad from 'Components/ImageLoad';
import { calVideoTime } from 'Utils/utils';

import responsiveStyles from 'Constants/style/responsive.less';
import prefetchSaga from './prefetch';
import styles from './audio.less';
import { LOAD_POSITION, VOLUME } from './constant';

const { Paragraph } = Typography;

/**
 * PageName: 电视栏目信息页/频道信息页
 * 除获取详情接口不同，其余逻辑一样
 * 如果后期两者逻辑有不一样，建议复制分开为两个组件
 *
 * 2020年9月28日
 * 新增displayTypeSecond字段，代表二级列表显示类型，0宫格，1图文
 */

class AudioChannelDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpand: false,
            beginScore: undefined,
            searchByTime: false,
            currentPage: 1,
            // 首屏加载
            isHome: true,
            // 点击加载的次数
            times: 1,
            // 频道最近一条新闻
            channelLastestNews: {}
        };
    }

    static prefetch = prefetchSaga;

    async componentDidMount() {
        if (!this.props.isPrefetch) {
            const { columnPk, channelPk } = this.props.match.params;
            if (columnPk) {
                await new Promise((resolve, reject) => {
                    this.props.getColumnInfo({ columnPk }, resolve, reject);
                });
            }
            if (channelPk) {
                await new Promise((resolve, reject) => {
                    this.props.getChannelInfo({ channelPk }, resolve, reject);
                });
                const { columnVideoList } = this.props;
                const [lastest] = columnVideoList;
                this.setState({ channelLastestNews: lastest });
            }
        }
        const { columnInfo } = this.props;
        this.setState({
            beginScore: moment(columnInfo.updateAt).startOf('month').valueOf()
        });
        window.addEventListener('scroll', this.handleScrollLoad);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScrollLoad);
    }

    /**
     * 滚动加载
     * 每加载一定页数时停止，让用户点击加载更多
     */
    handleScrollLoad = () => {
        const {
            currentPage,
            beginScore,
            times
        } = this.state;
        const { isRequesting, hasMore } = this.props;
        // 非加载中 && 还有更多 && 当前页小于指定页数
        if (!isRequesting && hasMore && currentPage < VOLUME * times) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const { scrollHeight, clientHeight } = document.documentElement;
            const scrollBottom = scrollHeight - clientHeight - scrollTop;
            // 滚动超过指定位置
            if (scrollBottom < LOAD_POSITION) {
                this.setState({ currentPage: currentPage + 1 }, () => {
                    this.handleGetColumnVideoList({ beginScore });
                });
            }
        }
    }

    // 选择时间
    handleGetTime = (time) => {
        this.setState({
            beginScore: time,
            currentPage: 1,
            times: 1,
            searchByTime: true,
            isHome: false
        }, () => {
            this.handleGetColumnVideoList({ beginScore: time });
        });
    }

    /** 立刻播放,跳转到最新的电视栏目拆条回顾 */
    handlePlayNow = () => {
        console.log(this.props.columnVideoList);
        console.log(this.state.channelLastestNews);
        const [item] = this.props.columnVideoList;
        if (item) this.props.history.push(`/audio/${item.id}`);
        else {
            message.warn('当前暂无节目内容');
        }
    }

    /** 获取栏目视频 */
    handleGetColumnVideoList = () => {
        const { columnPk, channelPk } = this.props.match.params;
        const {
            currentPage, searchByTime, beginScore
        } = this.state;

        const { lastScore: _lastScore } = this.props;

        const data = {
            tvColumnPk: columnPk,
            channelId: channelPk,
            currentPage,
            searchByTime,
            ...{ beginScore: !searchByTime ? _lastScore : beginScore }
        };

        if (columnPk) {
            this.props.getColumnVideoList(data);
        } else if (channelPk) {
            this.props.getChannelNews(data);
        }
    }

    handleOnExpand = () => { this.setState({ isExpand: true }); }

    handleCloseExpand = () => { this.setState({ isExpand: false }); }

    /** 加载更多 */
    handleLoadMore = () => {
        const { times } = this.state;
        this.setState({ times: times + 1 }, this.handleScrollLoad);
    }

    onScroll = (e) => {
        if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 20) {
            // 滚动到底部需要做的事情
            this.handleLoadMore();
        }
    }

    render() {
        const {
            beginScore,
            isExpand
        } = this.state;
        const {
            history,
            columnInfo,
            columnVideoList
        } = this.props;

        return (
            <div className={[styles['audio-column']].join(' ')}>
                <div className={styles['audio-column-info']}>
                    <div className={[responsiveStyles.content, styles.info].join(' ')}>
                        {columnInfo.coverUrl &&
                        <div className={styles.cover}>
                            <ImageLoad src={columnInfo.coverUrl} />
                        </div>
                        }
                        <div className={styles.detail}>
                            <h2>{columnInfo.name}</h2>
                            <div className={styles.from}>
                                <div>最近更新：<span>{moment(columnInfo.updateAt).format('YYYY-MM-DD')}</span></div>
                                {columnInfo.source && <div>来源：<span>{columnInfo.source}</span></div>}
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
                            {!isExpand &&
                            <div className={styles['btn-group']}>
                                <Button onClick={this.handlePlayNow}>立即播放</Button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                {beginScore &&
                <div className={[styles.content, responsiveStyles.content].join(' ')}>
                    <div style={{ paddingBottom: 20 }} >
                        <MonthRadioWithYear
                            beginScore={beginScore}
                            onChangeTime={this.handleGetTime}
                        />
                    </div>
                    <div className={styles['audio-list']}>
                        <Scrollbars
                            ref='scrollBox'
                            autoHide={true}
                            autoHideTimeout={500}
                            onScroll={this.onScroll}
                        >
                            {columnVideoList?.length > 0 && columnVideoList.map((item, i) => <div className={styles['audio-item']} key={i}>
                                <div className={styles['audio-item-time']}>{moment(item.dataJSON.releasedAt).format('YYYY-MM-DD')}</div>
                                {/* <div className={styles['audio-item-time']}>{moment(item.dataJSON.releasedAt).format('HH:mm')}-{moment(item.dataJSON.releasedAt + item.dataJSON.timeLength * 1000).format('HH:mm')}</div> */}
                                <div className={styles['audio-item-name']}>{item.dataJSON.title}</div>
                                <div className={styles['audio-item-user']}>主播：{item.dataJSON.author}</div>
                                <div className={styles['audio-item-time']}>时长：{calVideoTime(item.dataJSON.timeLength)}</div>
                                <div className={styles['audio-item-op']}>
                                    <a onClick={() => history.push(`/audio/${item.id}`)}>播放</a>
                                </div>
                            </div>)}
                            {!columnVideoList?.length && <div className={styles['audio-item']}>
                                当前时间段暂无节目内容，换个时间试试看~
                            </div>
                            }
                        </Scrollbars>
                        {/* <div className={styles['load-component']}> */}
                        {/*    {!isRequesting && hasMore && currentPage == VOLUME * times && */}
                        {/*    <Button onClick={this.handleLoadMore}>点击加载更多~</Button> */}
                        {/*    } */}
                        {/* </div> */}
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default AudioChannelDetail;
