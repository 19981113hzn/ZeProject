import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import CardBox from 'Components/CardBox';
import { colSpan } from 'Constants/antProps';
import { completionArray } from 'Utils/tools';

import styles from './index.less';

/**
 * ModuleName: 卡片流
 * 每列1个,数量不限
 */
class CardFlowSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleCompletionArray = () => {
        const { flowData = [], isMulti } = this.props;
        if (isMulti) return flowData;
        return completionArray(flowData, 8);
    }

    render() {
        const { cardSize, isMulti } = this.props;
        const list = this.handleCompletionArray();
        return (
            <Row className={styles['card-flow-single']} gutter={12}>
                {list.map((item, i) => (
                    <Col {...colSpan} className={!isMulti && styles['flow-overview'] || ''} key={i}>
                        <CardBox
                            sourceData={item}
                            bottom={isMulti}
                            type={cardSize}
                            onClick={this.props.onClickCard}
                            extra={this.props.extra}
                        />
                    </Col>
                ))}
                {/* 占位置用的 */}
                {list.length == 0 &&
                    <Col {...colSpan} className={[styles['flow-overview'], styles.palceholder].join(' ')}>
                        <CardBox
                            sourceData={{}}
                            bottom={isMulti}
                            type={cardSize}
                        />
                    </Col>
                }
            </Row>
        );
    }
}

CardFlowSingle.propTypes = {
    // 列表数据
    flowData: PropTypes.array,
    // 卡片尺寸
    cardSize: PropTypes.string,
    // 是否多行
    isMulti: PropTypes.bool,
    // 点击卡片事件
    onClickCard: PropTypes.func,
    // 额外参数
    extra: PropTypes.object
};

export default CardFlowSingle;
