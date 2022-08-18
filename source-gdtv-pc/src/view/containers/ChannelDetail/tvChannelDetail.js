import React from 'react';
import moment from 'moment';
import { Spin, Button, Typography } from 'antd';
import HelmetSEO from 'Components/HelmetSEO';
import MonthRadioWithYear from 'Components/MonthRadioWithYear';
import CardFlow from 'Components/CardFlow';
import ImageLoad from 'Components/ImageLoad';
import {
    SeriesVideo, TvColumn, News, Topic
} from 'Components/ContentElement';
import { FLOW_TYPE } from 'Constants/type';
import { ENTITY_KEY, getDetailRoute } from 'Utils/utils';

import responsiveStyles from 'Constants/style/responsive.less';

import prefetchSaga from './prefetch';
import styles from './index.less';
import { VOLUME, LOAD_POSITION } from './constant';

const { Paragraph } = Typography;

/**
 * PageName: 电视栏目信息页/频道信息页
 * 除获取详情接口不同，其余逻辑一样
 * 如果后期两者逻辑有不一样，建议复制分开为两个组件
 *
 * 2020年9月28日
 * 新增displayTypeSecond字段，代表二级列表显示类型，0宫格，1图文
 */

class TvChannelDetail extends React.Component {
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
    handleToDetail = () => {
        const { columnPk, channelPk } = this.props.match.params;
        if (columnPk) {
            window.location.href = `/tvColumnVideo/${columnPk}`;
        }
        if (channelPk) {
            const { channelLastestNews } = this.state;
            const { data, type } = channelLastestNews;
            let newsData;
            try {
                newsData = JSON.parse(data);
            } catch (error) {
                newsData = {};
            }
            const { id, contentType } = newsData;
            const route = getDetailRoute({
                source: newsData,
                objectType: type,
                contentType,
                sid: id,
                channelId: channelPk
            });
            window.location.href = route;
        }
    }

    /** 获取栏目视频 */
    handleGetColumnVideoList = ({ beginScore }) => {
        const { columnPk, channelPk } = this.props.match.params;
        const { isHome, currentPage, searchByTime } = this.state;
        const data = {
            currentPage,
            searchByTime,
            beginScore: isHome && this.props.lastScore || beginScore,
        };
        if (columnPk) {
            data.tvColumnPk = columnPk;
            this.props.getColumnVideoList(data);
        } else if (channelPk) {
            data.channelId = channelPk;
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

    renderItem = (item, i) => {
        const { screenSize, columnInfo } = this.props;
        switch (`${item[ENTITY_KEY].objectType}`) {
            case `${FLOW_TYPE.NEWS}`:
                switch (`${item[ENTITY_KEY].contentType}`) {
                    case '0': // 文章
                    case '1': // 视频
                    case '2': // 图集
                    case '3': // 电视节目
                        return (<News source={item[ENTITY_KEY]} displayType={columnInfo.displayType} key={i} />);
                    case '4': // 剧集
                        return (<SeriesVideo source={item[ENTITY_KEY]} screenSize={screenSize} key={i} />);
                    default:
                        return null;
                }
            case `${FLOW_TYPE.TOPIC}`:
                switch (`${item[ENTITY_KEY].contentType}`) {
                    case '0': // 剧集
                        return (<SeriesVideo source={item[ENTITY_KEY]} screenSize={screenSize} key={i} />);
                    case '1': // 专题
                        return (<Topic source={item[ENTITY_KEY]} screenSize={screenSize} key={i} />);
                    default:
                        return null;
                }
            default:
                return null;
        }
    }

    render() {
        const {
            beginScore,
            currentPage,
            times,
            isExpand
        } = this.state;
        const {
            isRequesting,
            hasMore,
            columnInfo,
            columnVideoList
        } = this.props;

        const helmetData = {
            title: [columnInfo.name, '荔枝网'].filter(Boolean).join('-'),
            keywords: columnInfo.keyword,
            description: columnInfo.desc || columnInfo.source,
            imgUrl: columnInfo.coverUrl
        };
        return (
            <div className={[styles['tv-column'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={[
                    responsiveStyles.content,
                    columnInfo.displayTypeSecond == 1 && styles.wrapper || ''
                ].join(' ')}
                >
                    <div className={styles.info}>
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
                                <h4>简介</h4>
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
                                    <Button onClick={this.handleToDetail}>立即播放</Button>
                                </div>
                            }
                        </div>
                    </div>
                    {beginScore &&
                        <div className={styles.content}>
                            <div style={{ paddingBottom: 40 }} >
                                <MonthRadioWithYear
                                    beginScore={beginScore}
                                    onChangeTime={this.handleGetTime}
                                />
                            </div>
                            <Spin className={styles['column-video-list']} id='videoList' spinning={isRequesting} >
                                {!isRequesting && columnVideoList?.length == 0 && '当前时间段暂无节目内容，换个时间试试看~'}
                                {/* 视频样式 */}
                                {!columnInfo.displayTypeSecond && columnVideoList?.length > 0 &&
                                    <CardFlow
                                        flowData={columnVideoList}
                                        displayType={0}
                                        isMulti={true}
                                        extra={{
                                            channelId: this.props.newsContent?.channelPK,
                                            blank: false
                                        }}
                                    />
                                }
                                {/* 图文样式 */}
                                {columnInfo.displayTypeSecond == 1 && columnVideoList?.map(this.renderItem)}
                            </Spin>
                            <div className={styles['load-component']}>
                                {!isRequesting && hasMore && currentPage == VOLUME * times &&
                                    <Button onClick={this.handleLoadMore}>点击加载更多~</Button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default TvChannelDetail;
