import React, { Component } from 'react';
import { connect } from 'react-redux';

import prefetchSaga from '../prefetch';
import selectors from '../selectors';
import * as Actions from '../actions';

/**
 * PageName: 外链跳转页
 * 在管理后台【新建发布】那里发布的外链
 * 目的是跟文章、视频一样去记录历史
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

    componentWillMount() {
        document.getElementById('root').style.display = 'none';
    }

    async componentDidMount() {
        if (!this.props.isPrefetch) {
            await new Promise((resolve, reject) => {
                this.props.getNewsContent({
                    sid: this.props.match.params.id
                }, resolve, reject);
            });
        }

        const itv = setInterval(() => {
            const { newsContent } = this.props;
            const { crawlUrl = '/' } = newsContent;
            window.location.replace(crawlUrl);
            clearInterval(itv);
        }, 0);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Articles;
