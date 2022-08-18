import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import CardBox from 'Components/CardBox';

import { headColSpan, colSpan } from 'Constants/antProps';
import { composeArray, completionArray } from 'Utils/tools';

import styles from './index.less';
import AdCard from '../../AdCard';

/**
 * ModuleName: 卡片流
 *
 * 首位卡片占位2行2列,首位卡片支持定制
 * 其余每列2个,最多6列
 *
 * [use:首页热点,频道内容展示]
 */
class CardFlowDouble extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleComposeArray = () => {
        const { flowData = [], renderHeadCol } = this.props;
        const flow = renderHeadCol ? flowData.slice(0, 12) : flowData.slice(1, 13);
        const arr = completionArray(flow, 12);
        return composeArray(arr);
    }

    renderDefaultHeadCol = () => {
        const { flowData = [{}] } = this.props;
        return (
            <CardBox
                sourceData={flowData[0]}
                type='big'
                onClick={this.props.onClickCard}
            />
        );
    }

    renderHotNewImages = (item) => {
        if (item.images !== undefined) {
            const layoutStyle = {
                paddingTop: '56.6%'
            };
            return <AdCard
                addInnerAdCount={this.props.addInnerAdCount}
                layoutStyle={layoutStyle}
                sourceData={item}
                bottom={true}
                showTitle={true}
                type='swiper'/>;
        }
        return <CardBox
            sourceData={item}
            bottom={true}
            onClick={this.props.onClickCard}
            extra={this.props.extra}
        />;
    }

    render() {
        const {
            flowData = [], renderHeadCol = this.renderDefaultHeadCol
        } = this.props;
        const list = this.handleComposeArray();
        return (
            <Row className={styles['card-flow-double']} gutter={12}>
                {flowData.length > 0 &&
                    <Col {...headColSpan}>
                        {renderHeadCol()}
                    </Col>
                }
                {list.map(([item1, item2], i) => (
                    <Col {...colSpan} className={styles['flow-overview']} key={i}>
                        {item1 && this.renderHotNewImages(item1)}
                        {item2 && this.renderHotNewImages(item2)}
                    </Col>
                ))}
                {list.length === 0 &&
                    <Col {...colSpan} className={[styles['flow-overview'], styles.palceholder].join(' ')}>
                        {this.renderHotNewImages({})}
                        {this.renderHotNewImages({})}
                    </Col>
                }
            </Row>
        );
    }
}

CardFlowDouble.propTypes = {
    // 列表数据
    flowData: PropTypes.array,
    // 首位组件
    renderHeadCol: PropTypes.any,
    // 点击卡片事件
    onClickCard: PropTypes.func,
    // 额外参数
    extra: PropTypes.object
};

export default CardFlowDouble;
