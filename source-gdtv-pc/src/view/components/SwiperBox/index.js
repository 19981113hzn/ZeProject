import React, { Component } from 'react';
import Swiper from 'swiper';
import ReactDom from 'react-dom';

import { NEWS_ROUTE } from 'Constants/type';

import responsiveStyles from 'Constants/style/responsive.less';
import '../../../../node_modules/swiper/dist/css/swiper.min.css';
import styles from './index.less';
import FullAd from '../FullAd';

const SWIPER_DETAULT_ID = 'home-swiper-id';

/**
 * ModuleName: 首页轮播图
 *
 * Author: xuchunhua
 * use: [ 首页轮播图展示 ]
 *
*/
class SwiperBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.mySwiper = undefined;
    }

    componentDidMount() {
        const { swiperBoxId = SWIPER_DETAULT_ID } = this.props;
        const mySwiper = new Swiper(`#${swiperBoxId}`, {
            loop: false,
            // effect: 'fade',
            autoplay: true,
            observer: true,
            direction: 'horizontal',
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: this.renderBullet
            }
        });

        // 鼠标覆盖停止自动切换
        mySwiper.el.onmouseover = function () {
            mySwiper.autoplay.stop();
        };
        // 鼠标移出启动自动切换
        mySwiper.el.onmouseout = function () {
            mySwiper.autoplay.start();
        };
        mySwiper.pagination.el.onmouseout = function () {
            mySwiper.autoplay.start();
        };
        this.mySwiper = mySwiper;
    }

    /** 渐变图层 */
    getGradientBg = (bgColor) => bgColor && ({
        background: `linear-gradient(to right, ${bgColor}, rgba(0, 0, 0, 0))`
    })

    handleClick = (item) => {
        const { target, targetType } = item;
        switch (`${targetType}`) {
            case '0':
                window.open(target);
                break;
            case '1': {
                try {
                    const news = JSON.parse(target);
                    const { newsPk, contentType } = news;
                    window.open(`/${NEWS_ROUTE[contentType]}/${newsPk}`);
                } catch (error) {
                    console.log(error);
                }
                break;
            }
            case '2':
                // 跳转分类
                window.open(`/channels/${target}`);
                break;
            default:
                break;
        }
    }

    renderBullet = (i, className) => {
        const { bannerData = [] } = this.props;
        const item = bannerData[i];
        return item &&
            `<span class='${className}'>
                <div class='${styles['swiper-tab-pane']}' >
                    <div class='${styles['pane-title']}'>${item.title}</div>
                    <div class='${styles['pane-sub-title']}'>${item.subTitle}</div>
                </div>
            </span>`
            || '';
    }

    render() {
        const { bannerData = [], fullAd, swiperBoxId = SWIPER_DETAULT_ID } = this.props;
        const sourceData = fullAd?.length ? fullAd[parseInt(Math.random() * fullAd?.length, 10)] : undefined;
        const list = bannerData.slice(0, 7);
        return (
            <div className={[styles['swiper-box'], responsiveStyles.layout].join(' ')}>
                {sourceData && <FullAd sourceData={sourceData} />}
                <div className={['swiper-container', styles.swiper].join(' ')} id={swiperBoxId}>
                    <div className='swiper-wrapper'>
                        {list.map((item, i) => (
                            <div
                                className='swiper-slide'
                                style={{ background: item.backgroundColor }}
                                key={i}
                            >
                                <div
                                    className={styles['swiper-bg']}
                                    style={{ backgroundImage: `url(${item.coverUrl})` }}
                                    onClick={() => { this.handleClick(item); }}
                                >
                                    {/* <div
                                        className={[styles['bg-gradient'], styles['bg-gradient-left']].join(' ')}
                                        style={this.getGradientBg(item.backgroundColor)}
                                    />
                                    <div
                                        className={[styles['bg-gradient'], styles['bg-gradient-right']].join(' ')}
                                        style={this.getGradientBg(item.backgroundColor)}
                                    /> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles['pagination-container']}>
                    <div
                        className={[
                            'swiper-pagination',
                            responsiveStyles.content,
                            list.length == 6 && styles['page-size-VI'] || ''
                        ].join(' ')}
                    >
                        {list.map((item, i) => (
                            <div className={['swiper-pagination-bullet', i === 0 && 'swiper-pagination-bullet-active'].join(' ')} key={i}>
                                <div className={styles['swiper-tab-pane']}>
                                    <div className={styles['pane-title']}>{item.title}</div>
                                    <div className={styles['pane-sub-title']}>{item.subTitle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default SwiperBox;
