import React, { Component } from 'react';
import moment from 'moment';
import { Typography, Tag } from 'antd';
import ImageLoad from 'Components/ImageLoad';

import styles from './index.less';

const { Paragraph } = Typography;

/**
 * 专题展示模块
 */
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleOnExpand = () => { this.setState({ isExpand: true }); }

    handleCloseExpand = () => { this.setState({ isExpand: false }); }

    render() {
        const { isExpand } = this.state;
        const { source } = this.props;
        return (
            <div className={styles['el-topic']}>
                <div className={styles['cover-box']}>
                    <a href={`/topic/${source.id}`} target='_blank'>
                        <ImageLoad src={source.coverUrl} />
                    </a>
                </div>
                <div className={styles.detail} >
                    <h2>
                        <a href={`/topic/${source.id}`} target='_blank'>
                            <div dangerouslySetInnerHTML={{ __html: source.title }}></div>
                        </a>
                        <Tag>专题</Tag>
                    </h2>
                    <div className={styles.from}>
                        <div>最近更新：<span>{moment(source.updateAt).format('YYYY-MM-DD')}</span></div>
                        {source.tvChannelName &&
                            <div>来源：<span>{source.tvChannelName}</span></div>
                        }
                    </div>
                    <div className={styles.desc}>
                        <b>简介</b>
                        {!isExpand &&
                            <Paragraph
                                className={styles['desc-text']}
                                ellipsis={{ rows: 2, expandable: true, onExpand: this.handleOnExpand }}
                            >
                                {source.desc || '暂无简介'}
                            </Paragraph>
                        }
                        {isExpand &&
                            <div className={styles['desc-text']} onMouseLeave={this.handleCloseExpand}>
                                {source.desc || '暂无简介'}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
