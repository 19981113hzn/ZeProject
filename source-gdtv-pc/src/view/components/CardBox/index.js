import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import ImageLoad from 'Components/ImageLoad';
import {
    getEntity, getDetailRoute, getCompressCoverUrl, IMG_OSS_RESIZE
} from 'Utils/utils';
import { renderOverlay } from './tools';
import { CLASS_TYPE } from './constants';
import styles from './index.less';

const { Paragraph } = Typography;

/**
 * ModuleName: 卡片模块
 *
 */
class CardBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutStyle: []
        };
    }

    componentDidMount() {
        const { layoutStyle } = this.state;
        const { bottom, type = 'small' } = this.props;
        bottom && layoutStyle.push(styles['card-box-bottom']);
        type && layoutStyle.push(styles[CLASS_TYPE[type]]);
        this.setState({ layoutStyle });
    }

    /** 点击事件 */
    handleOnClick = () => {
        const { sourceData = {}, onClick = () => null } = this.props;
        onClick(sourceData);
    }

    /** 解析跳转链接 */
    handleRenderLink = () => {
        const { sourceData = {}, extra = {} } = this.props;
        const { customLink } = extra;
        // 使用自定义链接
        if (customLink) {
            if (customLink instanceof Function) {
                return customLink(sourceData);
            }
            return customLink;
        }
        const news = getEntity(sourceData, extra);
        const { id, contentType, objectType } = news;
        const route = getDetailRoute({
            source: news,
            objectType,
            contentType,
            sid: id,
            ...extra
        });
        return route;
    }

    render() {
        const { layoutStyle } = this.state;
        const { sourceData = {}, extra = {}, type = 'small' } = this.props;
        const { blank = true } = extra;
        const newsData = getEntity(sourceData, extra);
        const { coverUrl = '', title } = newsData;
        return (
            <div className={[styles['card-box'], ...layoutStyle].join(' ')}>
                <div className={styles['card-cover']}>
                    <a href={this.handleRenderLink()} title={title} target={blank && '_blank' || ''}>
                        <ImageLoad
                            className={styles.cover}
                            src={getCompressCoverUrl(coverUrl, IMG_OSS_RESIZE[type][0], IMG_OSS_RESIZE[type][1])}
                        />
                        <div className={styles['card-bg']} />
                        {renderOverlay(newsData)}
                    </a>
                </div>
                <div className={styles['card-info']}>
                    <div className={styles['card-title-container']}>
                        <a
                            className={styles['card-title']}
                            href={this.handleRenderLink()}
                            title={title}
                            target={blank && '_blank' || ''}
                        >
                            <Paragraph ellipsis={{ rows: 2 }}>
                                {title || '...'}
                            </Paragraph>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

CardBox.propTypes = {
    sourceData: PropTypes.object.isRequired,
    // 卡片尺寸类型 [CLASS_TYPE]
    type: PropTypes.string,
    // 控制样式margin-bottom
    bottom: PropTypes.bool,
    // 点击卡片事件
    onClick: PropTypes.func,
    // 额外参数
    extra: PropTypes.shape({
        // 实体类型
        entityType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        // 自定义链接
        customLink: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        // 新开窗口
        blank: PropTypes.bool,
        // 剧集第几集,起始位1
        episodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        // 频道id
        channelId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
};

export default CardBox;
