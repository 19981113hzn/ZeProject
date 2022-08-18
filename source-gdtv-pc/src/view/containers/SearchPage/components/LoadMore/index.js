import React from 'react';
import { Button } from 'antd';

import styles from './index.less';

const TYPE_TEXT = {
    undefined: '内容',
    0: '剧集',
    1: '电视节目',
    2: '专题',
    3: '新闻'
};

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            pageNum: 1,
        };
    }

    handleLoadMore = async () => {
        const { pageNum } = this.state;
        const { type, pageSize } = this.props;
        this.setState({ isLoading: true });
        await this.props.onLoad({ pageNum: pageNum + 1, type, pageSize });
        this.setState({ pageNum: pageNum + 1, isLoading: false });
    }

    render() {
        const { isLoading } = this.state;
        const {
            children, sources, total, type
        } = this.props;
        return total > 0 && (
            <div className={styles['load-more']}>
                {children}
                {sources.length < total &&
                    <Button
                        className={styles['btn-load']}
                        onClick={this.handleLoadMore}
                        loading={isLoading}
                        block
                    >
                        查看更多相关{TYPE_TEXT[type]}
                    </Button>
                }
            </div>
        );
    }
}
