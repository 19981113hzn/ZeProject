import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardFlowSingle from 'Components/CardFlow/Single';
import CardFlowDouble from 'Components/CardFlow/Double';

/**
 * ModuleName: 卡片信息流
 */
class CardFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    renderDisplayType = () => {
        const {
            flowData, displayType = 0, isMulti
        } = this.props;
        switch (`${displayType}`) {
            case '0':
                return (
                    <CardFlowSingle
                        flowData={flowData || []}
                        isMulti={isMulti}
                        onClickCard={this.props.onClickCard}
                        extra={this.props.extra}
                    />
                );

            case '1':
                return (
                    <CardFlowSingle
                        flowData={flowData || []}
                        cardSize='vertical'
                        isMulti={isMulti}
                        onClickCard={this.props.onClickCard}
                        extra={this.props.extra}
                    />
                );

            case '2':
                return (
                    <CardFlowDouble
                        flowData={flowData || []}
                        onClickCard={this.props.onClickCard}
                        extra={this.props.extra}
                    />
                );

            default:
                return (<div></div>);
        }
    }

    render() {
        return this.renderDisplayType();
    }
}

CardFlow.propTypes = {
    // 列表数据
    flowData: PropTypes.array,
    // 展现形式[后台数据决定]
    displayType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    // 是否多行,仅 displayType = 0|1 生效
    isMulti: PropTypes.bool,
    // 点击卡片事件
    onClickCard: PropTypes.func,
    // 额外参数
    extra: PropTypes.object
};
export default CardFlow;
