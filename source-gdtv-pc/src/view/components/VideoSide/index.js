import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import ImageLoad from 'Components/ImageLoad';

import styles from './index.less';

const DEFAULT_ITEM_ATTR = {
    title: 'title',
    coverUrl: 'coverUrl',
    releasedAt: 'releasedAt'
};

/**
 * 播放器侧边栏
 */
class VideoSide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleOnItemClick = (item, index) => {
        const { onItemClick = () => null } = this.props;
        onItemClick(item, index);
    }

    render() {
        const {
            title,
            titleLink,
            sourceList = [],
            activeIndex,
            itemAttr = DEFAULT_ITEM_ATTR,
            scrollbarsConfig = {}
        } = this.props;
        return (
            <div className={styles['video-side-container']}>
                <div className={styles['title-container']}>
                    <h3>
                        <a href={titleLink}>{title}</a>
                    </h3>
                </div>
                <Scrollbars className={styles['list-container']} autoHide={true} autoHideTimeout={500} {...scrollbarsConfig}>
                    {sourceList.map((item, i) => (
                        <div className={styles['list-item']} onClick={() => this.handleOnItemClick(item, i)} key={i}>
                            <div className={styles['img-box']}>
                                <ImageLoad src={item[itemAttr.coverUrl]} isLazyLoad={false} />
                            </div>
                            <div className={[styles['text-box'], i == activeIndex && styles.active].join(' ')}>
                                <p>{item[itemAttr.title]}</p>
                                <p>{moment(item[itemAttr.releasedAt]).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </div>
                        </div>
                    ))}
                </Scrollbars>
            </div>
        );
    }
}

VideoSide.propTypes = {
    // 标题
    title: PropTypes.string,
    // 标题链接
    titleLink: PropTypes.string,
    // 列表
    sourceList: PropTypes.array,
    // 列表item
    itemAttr: PropTypes.shape({
        // 标题
        title: PropTypes.string,
        // 封面
        coverUrl: PropTypes.string,
        // 发布时间
        releasedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    onItemClick: PropTypes.func,
    // 当前激活index
    activeIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default VideoSide;
