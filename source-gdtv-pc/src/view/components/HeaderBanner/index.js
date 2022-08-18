import React, { Component } from 'react';
import { NEWS_ROUTE } from 'Constants/type';

import styles from './index.less';
import AdCard, { ADD_AD_TYPE } from '../AdCard';

/**
 * ModuleName: 通用banner
 *
 * Author: xuchunhua
 * use: [ 页面通用banner展示 ]
 *
 */
export default class HeaderBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offsetWidth: 0,
            displayMap: {},
            timmer: []
        };
    }

    async componentDidMount() {
        await this.setState({ offsetWidth: document.body.offsetWidth });
        this.handleInitTimmer(this.props.bannerList);
    }

    componentWillUnmount() {
        const { timmer } = this.state;
        timmer.forEach(t => {
            clearTimeout(t);
        });
    }

    /**
     * 给子元素设置定时器
     * 没有延迟显示 show
     * 延时显示 timeout show
     * 显示后再延时隐藏 timeout hide
     */
    handleInitTimmer = (list = []) => {
        list.forEach(item => {
            this.handleShowBanner(item);
        });
    }

    /** 定时显示banner */
    handleShowBanner = (banner) => {
        const { timmer, offsetWidth = document.body.offsetWidth, displayMap } = this.state;
        const {
            appearOffset, disappearOffset, pk, coverUrl
        } = banner;
        const t = setTimeout(async () => {
            displayMap[pk] = await this.getImageHeight(coverUrl, offsetWidth);
            this.setState({ displayMap });
            this.props.addInnerAdCount({ pks: [pk], type: ADD_AD_TYPE.VIEW });
            if (disappearOffset) { this.handleHideBanner(banner); }
        }, appearOffset * 1000 || 100);
        timmer.push(t);
        this.setState({ timmer });
    }

    /** 定时隐藏banner */
    handleHideBanner = (banner) => {
        const { timmer } = this.state;
        const { disappearOffset, pk } = banner;
        const t = setTimeout(() => {
            if (this) {
                const { displayMap } = this.state;
                displayMap[pk] = false;
                this.setState({ displayMap });
            }
        }, disappearOffset * 1000);
        timmer.push(t);
        this.setState({ timmer });
    }

    handleRenderLink = (item) => {
        const { target, targetType } = item;
        switch (`${targetType}`) {
            case '0':
                return target;
            case '1': {
                try {
                    const news = JSON.parse(target);
                    const { newsPk, contentType } = news;
                    return `/${NEWS_ROUTE[contentType]}/${newsPk}`;
                } catch (error) {
                    return '';
                }
            }
            case '2':
                // 跳转分类
                return `/channels/${target}`;
            default:
                return '';
        }
    }

    handleClickLink = (banner) => {
        if (banner.images) this.props.addInnerAdCount({ pks: [banner.pk], type: ADD_AD_TYPE.CLICK });
    }

    getImageHeight = async (src, offsetWidth) => {
        const img = new Image();
        img.src = src;
        try {
            const height = await new Promise((resolve, reject) => {
                img.onload = () => {
                    resolve(img.height * offsetWidth / img.width);
                };
            });
            return height;
        } catch (error) {
            return 0;
        }
    }

    render() {
        const { bannerList = [], addInnerAdCount } = this.props;
        const { displayMap } = this.state;
        return (
            <div className={styles['header-banner']}>
                {bannerList.map(banner => {
                    if (!banner.position) {
                        return <div
                            className={styles.banner}
                            style={{
                                backgroundColor: banner.backgroundColor,
                                maxHeight: displayMap[banner.pk] || ''
                            }}
                            title={banner.title}
                            key={banner.pk}
                        >
                            <a href={this.handleRenderLink(banner)} onClick={() => this.handleClickLink(banner)}>
                                <img src={banner.coverUrl} crossOrigin='anonymous' />
                            </a>
                        </div>;
                    }
                    return <AdCard sourceData={banner} layoutStyle={
                        {
                            position: 'relative',
                            backgroundColor: banner.backgroundColor,
                            maxHeight: displayMap[banner.pk] || ''
                        }
                    } addInnerAdCount={addInnerAdCount} key={banner.pk} isFullAd={true}/>;
                })}
            </div>
        );
    }
}
