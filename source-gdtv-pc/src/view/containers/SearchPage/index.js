import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import {
    SeriesVideo, TvColumn, News, Topic, AudioColumn
} from 'Components/ContentElement';
import HelmetSEO from 'Components/HelmetSEO';

import { urlParams } from 'Utils/utils';
import responsiveStyles from 'Constants/style/responsive.less';

import LoadMore from './components/LoadMore';

import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';

/**
 * PageName: 电视栏目信息详情页
 */
@connect(selectors, {
    searchNews: Actions.searchNews.request,
    leavePage: Actions.leavePage
})
class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        if (!this.props.isPrefetch) {
            const { key = '' } = urlParams();
            this.setState({
                keyword: decodeURIComponent(key)
            }, () => {
                this.searchNews();
            });
        }
    }

    componentWillUnmount() {
        this.props.leavePage();
    }

    searchNews = async (params = {}) => {
        const { keyword } = this.state;
        if (keyword) {
            // ALL(-1), SERIES(0), TV_COLUMN(1), TOPIC(2), VIDEO(3), PICTURE(4), ARTICLE(5),TV_COLUMN_NEWS(6),SERIES_NEWS(7)
            const { type = -1, pageNum = 1, pageSize = 15 } = params;
            const data = {
                keyword,
                pageNum,
                type,
                pageSize
            };
            await new Promise((resolve, reject) => {
                this.props.searchNews(data, resolve, reject);
            });
        }
    }

    /** 高亮关键字 */
    renderHighlight = (str, keyword) => {
        const regExp = new RegExp(keyword, 'g');
        return str.replace(regExp, `<span style="color:#F12D37">${keyword}</span>`);
    }

    render() {
        const { screenSize } = this.props;
        const { keyword = '' } = this.state;
        const {
            isRequesting,
            total,
            series,
            tvColumns,
            topics,
            newsItems
        } = this.props;

        const helmetData = {
            title: ['搜索', '荔枝网'].filter(Boolean).join('-')
        };
        return (
            <div className={[responsiveStyles.layout, styles['search-page']].join(' ')}>
                <HelmetSEO {...helmetData} />
                <div className={[responsiveStyles.content, styles.content].join(' ')}>
                    <div className={styles['search-result-tips']}>
                        为您找到与“<b>{keyword}</b>”相关的内容：<span>{total}</span>条
                    </div>
                    <Spin spinning={isRequesting}>
                        {total > 0 &&
                            <div className={styles['search-result']}>
                                {/* 剧集 */}
                                <LoadMore sources={series?.list} total={series?.total} type={0} onLoad={this.searchNews}>
                                    {series?.list?.map((el) => (
                                        <SeriesVideo
                                            source={{ ...el, title: this.renderHighlight(el.title, keyword) }}
                                            key={el.id}
                                            screenSize={screenSize}
                                        />
                                    ))}
                                </LoadMore>
                                {/* 电视节目 广播节目 category来判断 */}
                                <LoadMore sources={tvColumns?.list} total={tvColumns?.total} type={1} onLoad={this.searchNews} >
                                    {tvColumns?.list?.map((el) => {
                                        const columnProps = {
                                            source: { ...el, name: this.renderHighlight(el.name, keyword) },
                                            key: el.pk,
                                            screenSize
                                        };
                                        return el.category === 0 ? <TvColumn {...columnProps} /> : <AudioColumn {...columnProps} />;
                                    })}
                                </LoadMore>
                                {/* 专题 */}
                                <LoadMore sources={topics?.list} total={topics?.total} type={2} onLoad={this.searchNews} >
                                    {topics?.list?.map((el) => (
                                        <Topic
                                            source={{ ...el, title: this.renderHighlight(el.title, keyword) }}
                                            key={el.id}
                                        />
                                    ))}
                                </LoadMore>
                                {/* 新闻 */}
                                <LoadMore sources={newsItems?.list} total={newsItems?.total} type={3} onLoad={this.searchNews}>
                                    {newsItems?.list?.map((el) => (
                                        <News
                                            source={{ ...el, title: this.renderHighlight(el.title, keyword) }}
                                            key={el.id}
                                        />
                                    ))}
                                </LoadMore>
                            </div>
                        }
                    </Spin>
                </div>
            </div>
        );
    }
}

export default SearchPage;
