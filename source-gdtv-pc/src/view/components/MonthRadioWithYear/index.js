import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Select, Radio
} from 'antd';

import styles from './index.less';

const { Option } = Select;
const YEARS = 2015;
const MONTH = 12;

/**
 * 月份选择
 * 默认显示当前月
 */
class MonthRadioWithYear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currnetYear: undefined,
            currentMonth: undefined,
            selectedYear: undefined,
            selectedMonth: undefined
        };
    }

    componentWillMount() {
        const { beginScore } = this.props;
        const [currnetYear, currentMonth] = moment(beginScore).format('YYYY-MM').split('-');
        this.setState({
            currnetYear,
            currentMonth,
            selectedYear: currnetYear,
            // selectedMonth: currentMonth
        });
    }

    handleSelectYear = (e) => {
        const { onChangeTime = () => null } = this.props;
        const { currnetYear, currentMonth } = this.state;
        const month = currnetYear === e ? currentMonth : 12;
        this.setState({
            selectedYear: e,
            selectedMonth: month
        });
        onChangeTime(
            moment()
                .year(e)
                .month(month - 1)
                .startOf('month')
                .valueOf()
        );
    }

    handleSelectMonth = (e) => {
        const { onChangeTime = () => null } = this.props;
        const { selectedYear } = this.state;
        const { value } = e.target;
        this.setState({ selectedMonth: value });
        onChangeTime(
            moment()
                .year(selectedYear)
                .month(value - 1)
                .startOf('month')
                .valueOf()
        );
    }

    renderYearOption = () => {
        const { currnetYear } = this.state;
        const array = [];
        if (currnetYear) {
            for (let i = currnetYear; i >= YEARS; i -= 1) {
                array.push(<Option value={i} key={i}>{i}</Option>);
            }
        }
        return array;
    }

    renderMonthRadio = () => {
        const { currnetYear, currentMonth, selectedYear } = this.state;
        const month = currnetYear === selectedYear ? currentMonth : 12;
        const array = [];
        if (currnetYear) {
            for (let i = +month; i >= 1; i -= 1) {
                array.push(
                    <a key={i}>
                        <Radio.Button className={styles.month} value={i}>{i}月</Radio.Button>
                    </a>
                );
            }
        }
        return array;
    }

    render() {
        const { selectedYear, selectedMonth } = this.state;
        return (
            <div className={styles['month-radio-with-year']}>
                <Select
                    className={styles['year-group']}
                    value={selectedYear}
                    onChange={this.handleSelectYear}
                >
                    {this.renderYearOption()}
                </Select>
                <Radio.Group
                    className={styles['month-group']}
                    buttonStyle='solid'
                    value={selectedMonth}
                    onChange={this.handleSelectMonth}
                >
                    {this.renderMonthRadio()}
                </Radio.Group>

            </div>
        );
    }
}

MonthRadioWithYear.propTypes = {
    onChangeTime: PropTypes.func
};

export default MonthRadioWithYear;
