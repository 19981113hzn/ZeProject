import React from 'react';
import { calVideoTime } from 'Utils/utils';
import { FLOW_TYPE } from 'Constants/type';
import { LIVE_STATUS } from './constants';
import styles from './index.less';

/**
 * 渲染角标
 * @param {*} sourceData 
 */
export const renderOverlay = (sourceData) => {
    const { contentType, objectType } = sourceData;
    let content = '';
    switch (`${objectType}`) {
        case `${FLOW_TYPE.NEWS}`: {
            const { timeLength, imageCount } = sourceData;
            switch (`${contentType}`) {
                case '1': // 视频
                case '3': // 电视节目
                case '4': // 剧集
                    content = timeLength ? (
                        <span className={[styles['p-rb'], styles['p-bg']].join(' ')}>
                            {calVideoTime(timeLength)}
                        </span>
                    ) : '';
                    break;
                case '2': // 图集
                    content = imageCount ? (
                        <span className={[styles['p-rb'], styles['p-bg']].join(' ')}>
                            {imageCount}图
                        </span>
                    ) : '';
                    break;
                default:
                    break;
            }
            break;
        }

        case `${FLOW_TYPE.TOPIC}`: {
            switch (`${contentType}`) {
                case '1': // 专题
                    content = (<span className={[styles['p-rb'], styles['p-bg']].join(' ')}>专题</span>);
                    break;
                default:
                    break;
            }
            break;
        }

        case `${FLOW_TYPE.OUTLINK}`:
            break;

        case `${FLOW_TYPE.LIVE}`:
            content = (
                <span className={[styles['p-rb'], styles['p-bg']].join(' ')}>
                    {LIVE_STATUS[sourceData.status]}
                </span>
            );
            break;

        default:
            break;
    }
    return (
        <div className={styles.overlay}>
            {content}
        </div>
    );
};
