import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Typography } from 'antd';

import { ENTITY_TYPE, getCompressCoverUrl, getDetailRoute } from 'Utils/utils';
import ImageLoad from 'Components/ImageLoad';
import RollingNews from 'Components/RollingNews';
import CardFlowDouble from 'Components/CardFlow/Double';

import Swiper from 'swiper';
import styles from './index.less';
import { IMG_OSS_RESIZE, toJson } from '../../utils/utils';
import AdCard from '../AdCard';

const { Paragraph } = Typography;

const SWIPER_DETAULT_ID = 'hot-news-swiper-id';

/**
 * PageName: 热点新闻
 */
class HotNews extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { swiperBoxId = SWIPER_DETAULT_ID } = this.props;
        const mySwiper = new Swiper(`#${swiperBoxId}`, {
            loop: true,
            loopPreventsSlide: true, // 默认true，阻止
            autoplay: true,
            direction: 'horizontal',
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            observer: true, // 启动动态检查器(OB/观众/观看者)
            observeParents: true,
            observeSlideChildren: true
        });

        // 鼠标覆盖停止自动切换
        // mySwiper.el.onmouseover = function () {
        //     mySwiper.autoplay.stop();
        // };
        // // 鼠标移出启动自动切换
        // mySwiper.el.onmouseout = function () {
        //     mySwiper.autoplay.start();
        // };
        this.mySwiper = mySwiper;
    }

    handleRenderLink = (news) => getDetailRoute({
        source: news,
        objectType: news.objectType,
        contentType: news.contentType,
        sid: news.id
    })

    renderHeadCol = () => {
        const { textNews = [] } = this.props;
        return (
            <div className={styles.warpper}>
                <div className={styles['news-flow-box']}>
                    {[textNews.slice(2, 7), textNews.slice(7, 12)].map((group, k) => (
                        <div className={styles['news-flow']} key={k}>
                            {group.map((newsGroup, i) => (
                                <Row className={styles['news-col']} key={i}>
                                    {newsGroup.map((news, j) => j < 2 && (
                                        <Col span={24 / (newsGroup.length < 2 ? 1 : 2)} key={j}>
                                            <a
                                                className={styles['news-title']}
                                                title={news.title}
                                                style={{ ...news.titleStyle }}
                                                href={this.handleRenderLink(news)}
                                            >
                                                <Paragraph ellipsis={{ rows: (k == 0 && i == 0) ? 5 : 1 }}>
                                                    {news.title}
                                                </Paragraph>
                                            </a>
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    safeTurnAttrBy = (isOver0 = false) => {
        const filters = x => (isOver0 ? x.position > 0 : x.position < 0);
        const { tabVideos = [] } = this.props;
        try {
            return tabVideos
                .filter(filters)
                .map(item => {
                    const { web: coverUrl } = toJson(item.images);
                    const cornerMark = toJson(item.cornerMark);
                    return { ...item, coverUrl, cornerMark };
                });
        } catch (e) {
            throw new Error('运营位推荐视频封面解析异常');
        }
    }

    render() {
        const {
            textNews = [],
            pictrueNews = [],
            rollNews = [],
            swiperBoxId = SWIPER_DETAULT_ID
        } = this.props;

        const pictureNewZero = pictrueNews[0] || [];
        const concatPictureNew = pictrueNews.slice(1)
            .map(item => item[0])
            .map((item, position) => ({ ...item, position: position + 1 }))
            .concat(this.safeTurnAttrBy(true))
            .sort((a, b) => (a.position - b.position));

        const pictures = pictureNewZero.concat(this.safeTurnAttrBy());
        const layoutStyle = {
            display: 'block',
            height: 80,
        };

        return (
            <div className={styles['hot-news-container']}>
                <Row className={styles['hot-news-header']} gutter={12}>
                    <Col {...{ sm: 24, xl: 16, xxl: 15 }}>
                        {textNews.slice(0, 2).map((newsGroup, i) => (
                            <div className={styles['header-title-group']} key={i}>
                                {newsGroup.map((news, j) => (
                                    <a
                                        className={styles['header-title']}
                                        title={news.title}
                                        style={{ ...news.titleStyle }}
                                        href={this.handleRenderLink(news)}
                                        key={j}
                                    >
                                        {i == 0 && j == 0 && <span className={styles.tag}></span>}
                                        {news.title}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </Col>
                    <Col {...{ sm: 24, xl: 8, xxl: 6 }}>
                        <div className={'swiper-container'} id={swiperBoxId}>
                            <div className='swiper-wrapper' style={{ borderRadius: 8 }}>
                                {pictures.map((item, i) => (
                                    <div
                                        className='swiper-slide'
                                        key={i}>
                                        {
                                            item.images !== undefined
                                                ? <AdCard
                                                    addInnerAdCount={this.props.addInnerAdCount}
                                                    layoutStyle={layoutStyle}
                                                    sourceData={item}
                                                    type='swiper'/>
                                                : <a className={styles['header-side']} href={this.handleRenderLink(item)}>
                                                    <ImageLoad
                                                        className={styles['header-side-round-img']}
                                                        src={getCompressCoverUrl(item.coverUrl, IMG_OSS_RESIZE.swiper[0], IMG_OSS_RESIZE.swiper[1])}/>
                                                </a>
                                        }
                                    </div>
                                ))}
                            </div>
                            {/* <div className="swiper-button-prev"></div> */}
                            {/* <div className="swiper-button-next"></div> */}
                        </div>
                    </Col>
                </Row>
                <div className={styles['hot-news']}>
                    <CardFlowDouble
                        addInnerAdCount={this.props.addInnerAdCount}
                        flowData={concatPictureNew}
                        renderHeadCol={this.renderHeadCol}
                        extra={{ entityType: ENTITY_TYPE.DATA_JSON }}
                    />
                    {rollNews?.length > 0 &&
                        <div className={styles['rolling-news']}>
                            <RollingNews sourceData={rollNews} />
                        </div>
                    }
                </div>
            </div>
        );
    }
}
HotNews.propTypes = {
    // 文字新闻
    textNews: PropTypes.array.isRequired,
    // 图片新闻
    pictrueNews: PropTypes.array.isRequired,
    // 滚动新闻
    rollNews: PropTypes.array.isRequired

};

export default HotNews;
