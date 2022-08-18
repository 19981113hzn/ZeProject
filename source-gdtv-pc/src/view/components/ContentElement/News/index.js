import React, { Component } from 'react';
import moment from 'moment';
import ImageLoad from 'Components/ImageLoad';
import { renderOverlay } from 'Components/CardBox/tools';
import { NEWS_CONTENT_TYPE } from 'Constants/type';

import { getDetailRoute } from 'Utils/utils';

import styles from './index.less';

/** 新闻内容类型文字 */
const NEWS_CONTENT_TYPE_DESC = {
    undefined: '未知',
    [NEWS_CONTENT_TYPE.ARTICAL]: '图文',
    [NEWS_CONTENT_TYPE.VIDEO]: '视频',
    [NEWS_CONTENT_TYPE.GALLERY]: '图集',
    // 电视节目下单个视频
    [NEWS_CONTENT_TYPE.TV]: '视频',
    // 剧集下单个视频
    [NEWS_CONTENT_TYPE.SERIES]: '视频',
    [NEWS_CONTENT_TYPE.OUTLINK]: '外链',
    [NEWS_CONTENT_TYPE.AUDIO]: '广播'
};

/**
 * 新闻展示模块
 * [0图文|1视频|2图集|3电视节目|4剧集|5外链|6广播节目]
 */
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClick = () => {
        const { source } = this.props;
        const route = getDetailRoute({
            source,
            objectType: 0,
            contentType: source.contentType,
            sid: source.id
        });
        window.open(route);
    }

    /** 显示角标 */
    renderTagRb = () => {
        const { source = {} } = this.props;
        return renderOverlay(source);
    }

    render() {
        const { source, displayType } = this.props;
        return (
            <div className={styles['el-news']}>
                {source.coverUrl &&
                    <div className={[styles['cover-box'], displayType == 1 && styles.vertical].join(' ')}>
                        <a onClick={this.handleClick}>
                            <ImageLoad src={source.coverUrl} />
                        </a>
                        {this.renderTagRb()}
                    </div>
                }
                <div className={styles.detail} >
                    <h2>
                        <a onClick={this.handleClick}>
                            <div dangerouslySetInnerHTML={{ __html: source.title }}></div>
                        </a>
                    </h2>
                    <div className={styles.from}>
                        <div>最近更新：<span>{moment(source.releasedAt).format('YYYY-MM-DD')}</span></div>
                        <div>类型：<span>{NEWS_CONTENT_TYPE_DESC[source.contentType]}</span></div>
                    </div>
                    {source.subTitle &&
                        <div className={styles['sub-title']}>{source.subTitle}</div>
                    }
                </div>
            </div>
        );
    }
}
