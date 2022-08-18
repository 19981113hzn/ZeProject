import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Typography, Icon } from 'antd';
import { getDetailRoute } from 'Utils/utils';
import HelmetSEO from 'Components/HelmetSEO';
// import HtmlParser from 'Components/HtmlParser';

let HtmlParser;

/*
*  todo: 旧组件不具备图片外链、地图等能力
*  @itouchtv/touchtv-html-parser 新的图文预览组件，但不能在ssr渲染中使用 （window is no defined）
*  临时方案采取ssr渲染时使用旧的HtmlParser
* */
if (typeof window === 'object') {
    HtmlParser = require('@itouchtv/touchtv-html-parser/dist/js/indexReact');
} else {
    HtmlParser = require('Components/HtmlParser').default;
}

// import HtmlParser from '@itouchtv/touchtv-html-parser/dist/js/indexReact';
import '@itouchtv/touchtv-html-parser/dist/css/indexReact.css';

import responsiveStyles from 'Constants/style/responsive.less';

import { saveAs } from 'file-saver';
import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';
import styles from './index.less';

const { Paragraph } = Typography;

const HEADER_FIXED_START = 400;
const HEADER_HEIGHT = 72;
const FOOTER_HEIGHT = 284;
const BOX_MAX_HEIGHT = 686;

/**
 * PageName: 资讯详情页
 *
 * Author: xuchunhua
 * use: [ ]
 */
@connect(selectors, {
    getNewsContent: Actions.getNewsContent.request,
})
class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fixed: false,
            fixedBottom: false
        };
        this.moreBox = undefined;
        this.articleBox = undefined;
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getNewsContent({
                sid: this.props.match.params.id
            });
        }
        window.addEventListener('scroll', this.fixedBar);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.fixedBar);
    }

    // 监听固定悬浮导航栏
    fixedBar = () => {
        if (!this.moreBox) {
            this.moreBox = this.refs.moreBox;
        }
        if (!this.articleBox) {
            this.articleBox = this.refs.articleBox;
        }
        // 文章dom比侧边栏dom高，则滑到底部时，侧边栏自动吸附到底部
        if (this.moreBox && this.articleBox && this.articleBox.clientHeight > this.moreBox.clientHeight) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const { scrollHeight, clientHeight } = document.documentElement;
            // 滚动条到底部距离
            const scrollBottom = scrollHeight - clientHeight - scrollTop;
            // 刚好完全展示moreBox高度边界值
            const bottomBoundary = HEADER_HEIGHT + 20 + this.moreBox.clientHeight + 120 + FOOTER_HEIGHT;
            // 底线
            const stopLine = bottomBoundary - clientHeight;

            let fixed = false;
            let fixedBottom = false;
            if (scrollTop > HEADER_FIXED_START) {
                fixed = scrollBottom > stopLine;
                fixedBottom = !fixed;
            }
            this.setState({ fixed, fixedBottom });
        }
    }

    /** 点击卡片 */
    handleOnClickCard = (channelNews) => {
        const { newsContent } = this.props;
        const { id, contentType, objectType } = channelNews;
        const route = getDetailRoute({
            source: channelNews,
            objectType,
            contentType,
            sid: id,
            channelId: newsContent.channelPK
        });
        window.open(route);
    }

    handleDownload = async (url, name) => {
        try {
            await saveAs(url, name);
        } catch (err) {
            window.open(url);
        }
    }

    render() {
        const { fixed, fixedBottom } = this.state;
        const { channelInfo = {}, newsContent, relateNews } = this.props;

        const { attaches = [] } = newsContent;
        const hasRelateNews = relateNews && relateNews.length > 0;

        const helmetData = {
            title: [newsContent.title, channelInfo.name, '荔枝网'].filter(Boolean).join('-'),
            keywords: newsContent.keyword,
            description: newsContent.summary || newsContent.helmetContent || channelInfo.name,
            imgUrl: newsContent.coverUrl
        };
        return (
            <div
                className={[responsiveStyles.layout, styles.article].join(' ')}
                style={{ minHeight: (typeof window == 'object' ? window.innerHeight : 800) - 72 }}
            >
                <HelmetSEO {...helmetData} />
                <div className={[responsiveStyles.content, styles.layout].join(' ')}>
                    <div
                        ref='articleBox'
                        className={[
                            styles['article-detail'],
                            !hasRelateNews && styles.overspread
                        ].join(' ')}
                    >
                        {newsContent.id && <React.Fragment>
                            <div className={styles['pre-sub-title']}>{newsContent.preSubTitle}</div>
                            <div className={styles.title}>{newsContent.title}</div>
                            <div className={styles['sub-title']}>{newsContent.subTitle}</div>
                            <div className={styles.media}>
                                {newsContent.from &&
                                <a href={newsContent.originLink || null} target='_blank'>
                                    <span>{newsContent.from}</span>
                                </a>
                                }
                                {newsContent.releasedAt && <span>{moment(newsContent.releasedAt).format('YYYY-MM-DD HH:mm')}</span>}
                                {newsContent.author && <span>作者：{newsContent.author}</span>}
                                {/* {newsContent.creator && <span>编辑：{newsContent.creator}</span>} */}
                            </div>
                            <hr />
                            <div className={styles['article-content']}>
                                {newsContent.summary &&
                                <p className={styles.summary}>
                                    摘要：{newsContent.summary}
                                </p>
                                }
                                {newsContent.content && newsContent.content != '' && (
                                    <HtmlParser
                                        fontSize="43.5"
                                        content={newsContent.content}
                                        autoLoad={true}
                                        audioProps={{ hasControls: true }}
                                        videoProps={{
                                            controls: { native: true }
                                        }}
                                    />
                                )}
                            </div>
                            <div className={styles.attaches}>
                                {attaches && attaches.map((item, i) => (
                                    <div key={i}>附件{i + 1}：<a onClick={() => this.handleDownload(item.url, item.name)}>{item.name} <Icon type='download' /></a></div>
                                ))}
                            </div>
                            <hr />
                            {/* {newsContent.from && newsContent.originLink &&
                            <a className={styles['origin-link']} href={newsContent.originLink} target='_blank'>
                                <Icon type='link' />原始链接：{newsContent.from}
                            </a>
                        } */}
                        </React.Fragment>}
                    </div>
                    {hasRelateNews &&
                        <div
                            ref='moreBox'
                            className={[
                                styles['more-box'],
                                fixed && styles.fixed,
                                fixedBottom && styles['fixed-bottom']
                            ].join(' ')}
                        >
                            <div className={styles['more-detail']}>
                                <p className={styles['text-more']}>更多精彩</p>
                                {relateNews.slice(0, 6).map((item, i) => (
                                    <div
                                        className={styles['flow-card']}
                                        onClick={() => { this.handleOnClickCard(item); }}
                                        key={i}
                                    >
                                        <div className={styles['news-title']}>
                                            <Paragraph ellipsis={{ rows: 2 }}>{item.title}</Paragraph>
                                        </div>
                                        <div
                                            className={styles['news-cover']}
                                            style={{ backgroundImage: `url(${item.coverUrl})` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Articles;
