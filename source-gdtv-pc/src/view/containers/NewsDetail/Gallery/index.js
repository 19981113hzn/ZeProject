import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Row, Col, Icon } from 'antd';
import HelmetSEO from 'Components/HelmetSEO';
import LoadingBox from 'Components/LoadingBox';
import CardFlow from 'Components/CardFlow';

import responsiveStyles from 'Constants/style/responsive.less';
import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';

/**
 * PageName: 图集详情页
 * 
 * Author: lishihua 
 * use: [ ]
 * 
*/
@connect(selectors, {
    getNewsContent: Actions.getNewsContent.request,
    getRecommendList: Actions.getRecommendList.request,
})
class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currPic: 0,
            loadIndex: 0,
            imgLoading: true,
            showArrow: false,
            isViewEnd: false,
            slideImgWidth: 0
        };
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getNewsContent({
                sid: this.props.match.params.id
            });
        }
    }

    componentWillUnmount() {
    }

    render() {
        const { channelInfo = {}, newsContent, relateNews } = this.props;
        const { images = [] } = newsContent;
        const { isViewEnd } = this.state;
        // const nexGallery = this.props.relateNews && this.props.relateNews[0];
        // const nexGalleryTile = nexGallery && nexGallery.title;
        // const nexGalleryCoverUrl = nexGallery && nexGallery.coverUrl;
        const currPicItem = images && images.length ? images[this.state.currPic] : {};
        const [helemetImage = {}] = images;

        const helmetData = {
            title: [newsContent.title, channelInfo.name, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsContent.keyword,
            description: helemetImage.desc || channelInfo.name,
            imgUrl: helemetImage.imgUrl || newsContent.coverUrl
        };
        return (
            <div className={[styles['news-content'], responsiveStyles.layout].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={[styles.detail, responsiveStyles.content].join(' ')}>
                    <Row>
                        <Col span={24}>
                            <h3>{newsContent.title}</h3>
                            <p className={styles.from}>
                                {newsContent.from && <span>来源：{newsContent.from}</span>}
                                <span>{moment(newsContent.releasedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                {newsContent.author && <span>作者：{newsContent.author}</span>}
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24} type="flex" justify="center" align="middle">
                            {!isViewEnd && <div className={styles['gallery-box']}>
                                <div
                                    style={{ position: 'relative' }}
                                    onMouseEnter={() => this.showArrow(true)}
                                    onMouseLeave={() => this.showArrow(false)}>

                                    {this.state.showArrow &&
                                        <img
                                            className={styles['arrow-left']}
                                            src={require('../../../statics/images/arrow_right_.png')}
                                            onClick={() => this.changePicIndex('sub', this.state.currPic)}
                                        />
                                    }
                                    {this.state.showArrow &&
                                        <img
                                            className={styles['arrow-right']}
                                            src={require('../../../statics/images/arrow_left_.png')}
                                            onClick={() => this.changePicIndex('add', this.state.currPic)}
                                        />
                                    }
                                    <Row>
                                        <Col span={3} type="flex" justify="center" align="middle">

                                        </Col>
                                        <Col span={18} type="flex" justify="center" align="middle">
                                            <div className={styles['img-warpper']}>
                                                <div className={styles['img-box']}>
                                                    {this.state.imgLoading && (
                                                        <div className={styles['images-loading']}>
                                                            <div className={styles['loading-box']}>
                                                                <LoadingBox loading={this.state.imgLoading} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={styles['curr-img']}
                                                        style={{
                                                            backgroundImage: `url(${currPicItem.imgUrl})`
                                                        }}
                                                    />
                                                    <img
                                                        style={{ display: 'none' }}
                                                        src={currPicItem && currPicItem.imgUrl ? currPicItem.imgUrl : ''}
                                                        onLoad={(e) => {
                                                            this.state.currPic == 0 && this.changePicIndex('add', -1);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={3} type="flex" justify="center" align="middle">

                                        </Col>
                                    </Row>
                                </div>

                                <div className={styles['summery-box']}>
                                    {images && <span>
                                        <i>{this.state.currPic + 1}</i>/<i>{images.length}</i>
                                    </span>}
                                    <p>{currPicItem.desc || newsContent.title}</p>
                                    {newsContent.originLink &&
                                        <a className={styles['origin-link']} href={newsContent.originLink} target='_blank'>
                                            <Icon type='link' />原始链接：{newsContent.originLink}
                                        </a>
                                    }
                                </div>
                                {images && <div className={styles['small-img']}>
                                    {this.state.currPic == 0 &&
                                        <img
                                            className={styles['color_arrow-left']}
                                            src={require('../../../statics/images/arrow_left_gray.png')}
                                        // onClick={() => this.changePicIndex('sub', this.state.currPic)}
                                        />
                                    }
                                    {this.state.currPic != 0 &&
                                        <img
                                            className={styles['color_arrow-left']}
                                            src={require('../../../statics/images/arrow_left_red.png')}
                                            onClick={() => this.changePicIndex('sub', this.state.currPic)}
                                        />
                                    }
                                    {this.state.currPic + 1 == images.length &&
                                        <img
                                            className={styles['color_arrow-right']}
                                            src={require('../../../statics/images/arrow_right_gray.png')}
                                        // onClick={() => this.changePicIndex('add', this.state.currPic)}
                                        />
                                    }
                                    {this.state.currPic + 1 != images.length &&
                                        <img
                                            className={styles['color_arrow-right']}
                                            src={require('../../../statics/images/arrow_right_red.png')}
                                            onClick={() => this.changePicIndex('add', this.state.currPic)}
                                        />
                                    }
                                    <div className={styles['list-box']} id='parent-box'>
                                        <ul>
                                            {images.map((ele, index) => (
                                                <li id={`nav-${index}`}
                                                    onClick={() => this.changePicIndex('skip', index)}
                                                    key={index}
                                                >
                                                    <img src={ele.imgUrl} alt="" />
                                                    {this.state.currPic == index &&
                                                        <span className={styles['border-box']}></span>
                                                    }
                                                </li>
                                            ))}
                                            {/* <li className={styles['next-gallery']}>
                                                <img src={nexGalleryCoverUrl} alt=""/>
                                                {<span className={styles['top-cover']}></span>}
                                                <div className={styles.text}>
                                                    <span>下一图集</span>
                                                    <p>{nexGalleryTile && nexGalleryTile.length > 12 ? (`${(nexGalleryTile).slice(0, 12)}...`) : nexGalleryTile}</p>
                                                </div>
                                            </li> */}
                                        </ul>
                                    </div>
                                </div>}
                            </div>}
                        </Col>
                    </Row>
                </div>

                {relateNews && relateNews.length > 0 &&
                    <div className={[styles['more-box'], responsiveStyles.content].join(' ')}>
                        <p className={styles['text-more']}>更多精彩</p>
                        <Row>
                            <Col span={24} type="flex">
                                <CardFlow
                                    flowData={relateNews}
                                    displayType={0}
                                    isMulti={true}
                                    extra={{
                                        channelId: this.props.newsContent?.channelPK,
                                        blank: false
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }


    /**
     * 
     * 切换图片
     * 
     * @params [string] type [切换类型： add - 下一张 | sub 上一张] | skip 点击小图定位
     * @params [number] index [当前下标]
     */
    changePicIndex = (type, index) => {
        const { newsContent } = this.props;
        const galleryList = newsContent.images || [];

        let _loadIndex = this.state.loadIndex;

        this.setState(Object.assign({}, this.state, { isViewEnd: false }));

        if (type == 'add') {
            if (index + 1 < galleryList.length) {
                if (_loadIndex < index + 1) {
                    _loadIndex = index + 1;
                    this.setState(Object.assign({}, this.state, {
                        imgLoading: this.state.loadIndex < index + 1,
                        loadIndex: _loadIndex
                    }));
                }

                let img = new Image();
                // img.src = newsContent.images[index + 1].imgUrl;
                img.src = galleryList[index + 1].imgUrl;
                img.onload = (e) => {
                    this.setState(Object.assign({}, this.state, {
                        currPic: index + 1,
                        imgLoading: false,
                    }));
                };
                img = null;
            } else {
                // this.setState(Object.assign({}, this.state, { isViewEnd: true }));
            }
        } else if (type == 'skip') {
            // this.setState(Object.assign({}, this.state, { currPic: index }));
            if (this.state.currPic !== index) {
                this.setState(Object.assign({}, this.state, {
                    imgLoading: true,
                }));
            }

            let img = new Image();
            // img.src = newsContent.images[index + 1].imgUrl;
            img.src = galleryList[index].imgUrl;
            img.onload = (e) => {
                this.setState(Object.assign({}, this.state, {
                    currPic: index,
                    imgLoading: false,
                }));
            };
            img = null;
        } else if (index > 0) {
            this.setState(Object.assign({}, this.state, { currPic: index - 1 }));
            console.log(this.state.currPic);
        }

        const current = document.getElementById(`nav-${this.state.currPic}`);
        this.scrollToView(current);
    }

    /**
     * 
     * 显示 / 隐藏切换图片按钮
     * 
     * @params [boolean] value [是否显示： true - 显示 | false - 隐藏]
     */
    showArrow = (value) => {
        this.setState(Object.assign({}, this.state, { showArrow: value }));
    }


    /**
     * 
     * 滚动效果
     */
    scrollToView(el) {
        if (!el) {
            return;
        }
        console.log('to');
        const parent = document.getElementById('parent-box');
        const p = (el.offsetLeft - parent.scrollLeft) + 300;
        const delta = p - (document.documentElement.clientWidth / 2);
        parent.scrollLeft += delta;
    }

    /** 下一个图集 */
    handleNextGallery() {
        const nexGalleryId = this.props.relateNews[0].id;
        console.log(this.props);
        // window.open(`/gallery/${nexGalleryId}`);
        // window.open('/gallery/2fa5acdfac6c5e79a89d66b65399c475');
        // this.props.history.push(`/gallery/${nexGalleryId}`);
        window.location.href = `/gallery/${nexGalleryId}`;
        // this.props.history.push('/gallery/2fa5acdfac6c5e79a89d66b65399c475');
        // window.location.reload();
    }
}

export default Gallery;
