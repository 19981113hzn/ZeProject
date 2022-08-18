import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Typography } from 'antd';
import ImageLoad from 'Components/ImageLoad';
import {
    getEntity, getCompressCoverUrl, IMG_OSS_RESIZE
} from 'Utils/utils';
import styles from './styles.less';
import { AD_TYPE, NEWS_ROUTE } from '../../constants/type';
import { CLASS_TYPE } from '../CardBox/constants';
import { toJson } from '../../utils/utils';

const { Paragraph } = Typography;

export const ADD_AD_TYPE = {
    VIEW: 1,
    CLICK: 2,
    BOTH: 3
};

/**
 * ModuleName: 卡片模块
 *
 */
class AdCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutClass: [],
            visible: false,
            duration: 0
        };
    }

    componentDidMount() {
        console.log('didmount', this.props.sourceData.pk);
        const { layoutClass } = this.state;
        const { bottom, type = 'small' } = this.props;
        bottom && layoutClass.push(styles['card-box-bottom']);
        type && layoutClass.push(styles[CLASS_TYPE[type]]);
        this.setState({ layoutClass });
        this.handleShowAd();
    }

    handleShowAd = () => {
        const { waitSecond } = this.props.sourceData;
        setTimeout(() => {
            this.setState({ visible: true });
            // if (playSecond) this.handleHiddenAd(playSecond);
        }, waitSecond * 1000 || 100);
    }

    handleHiddenAd = (playSecond) => {
        this.setState({ duration: playSecond });
        const itv = setInterval(() => {
            const { duration } = this.state;
            if (duration > 1) {
                this.setState({ visible: true, duration: duration - 1 });
            } else {
                this.setState({ visible: false, duration: 0 });
                clearInterval(itv);
            }
        }, 1000);
    }

    renderOverlay = () => {
        const { cornerMark } = this.props.sourceData;
        const _cornerMark = typeof cornerMark === 'string' ? JSON.parse(cornerMark) : cornerMark;
        const { corner } = _cornerMark;
        return (
            corner && <div className={styles.overlay}>
                <span className={[styles['p-lb'], styles['p-bg']].join(' ')}>
                    {corner}
                </span>
            </div>
        );
    }

    /** 解析跳转链接 */
    // eslint-disable-next-line consistent-return
    handleRenderLink = () => {
        const { target, targetType, contentType } = this.props.sourceData;
        switch (`${targetType}`) {
            case `${AD_TYPE.NONE}`:
                break;
            case `${AD_TYPE.OUTLINK}`:
                return target;
            case `${AD_TYPE.NEWS}`: {
                try {
                    return `/${NEWS_ROUTE[contentType]}/${target}`;
                } catch (e) {
                    console.log(NEWS_ROUTE, contentType);
                    return '';
                }
            }
            case `${AD_TYPE.TOPIC}`:
                return `/topic/${target}`;
            default:
                break;
        }
    }

    handleClickLink = () => {
        const { pk } = this.props.sourceData;
        this.props.addInnerAdCount({ pks: [pk], type: ADD_AD_TYPE.CLICK });
    }

    onload = ({ pk, playSecond }) => {
        console.log('onloadadsource', pk);
        this.props.addInnerAdCount({ pks: [pk], type: ADD_AD_TYPE.VIEW });
        if (playSecond) this.handleHiddenAd(playSecond);
    }

    renderCountDownTag = (props = {}) => {
        const { duration } = this.state;
        const { closeable } = props;

        return <React.Fragment>
            {duration && <div className={[styles.countDown, 'count-down'].join(' ')}>
                <span>广告倒计时&nbsp;|&nbsp;<span className={styles.countNumber}>{duration}</span>秒</span>
                {closeable && <Icon type="close" style={{ marginLeft: 5 }} onClick={(e) => {
                    this.setState({ visible: false });
                    e.stopPropagation();
                }}/>}
            </div>}
        </React.Fragment>;
    }

    render() {
        const { layoutClass, visible } = this.state;
        const {
            sourceData = {},
            extra = {},
            type = 'small',
            showTitle,
            showDuration = false,
            layoutStyle,
            isFullAd = false
        } = this.props;
        const { blank = true } = extra;
        const newsData = getEntity(sourceData, extra);
        const { title, images } = newsData;
        const { web } = toJson(images);
        if (isFullAd) {
            return visible && <div className={styles['card-cover']} style={layoutStyle}>
                <a
                    href={this.handleRenderLink()}
                    // title={title}
                    target={blank && '_blank' || ''}
                    onClick={this.handleClickLink}>
                    <ImageLoad
                        onload={() => this.onload(sourceData)}
                        className={styles.cover}
                        src={web}
                        // src={getCompressCoverUrl(web)}
                    />
                    <div className={styles['card-bg']} />
                    {this.renderOverlay(newsData)}
                    {showDuration && this.renderCountDownTag(this.props)}
                </a>
            </div>;
        }
        return (
            visible && <div className={[styles['card-box'], ...layoutClass].join(' ')}>
                <div className={styles['card-cover']} style={layoutStyle}>
                    <a
                        href={this.handleRenderLink()}
                        // title={title}
                        target={blank && '_blank' || ''}
                        onClick={this.handleClickLink}>
                        <ImageLoad
                            onload={() => this.onload(sourceData)}
                            className={styles.cover}
                            src={web}
                            // src={getCompressCoverUrl(web)}
                        />
                        <div className={styles['card-bg']} />
                        {this.renderOverlay(newsData)}
                        {showDuration && this.renderCountDownTag(this.props)}
                    </a>
                </div>
                {showTitle && <div className={styles['card-info']}>
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
                </div>}
            </div>
        );
    }
}

AdCard.propTypes = {
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

export default AdCard;
