import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Popover, Button, Icon,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import ContentElement from 'Components/ContentElement';

import * as AccountActions from 'Global/account/actions';
import AccountSelectors from 'Global/account/selectors';

import LoginBtn from '../LoginBtn';

import styles from './index.less';

@connect(AccountSelectors, {
    getBrowseHistory: AccountActions.getBrowseHistory.request
})
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 仅请求一次历史
            historyOnce: false,
            popoverVisible: undefined
        };
    }

    /**
     * 点击登录按钮时让Popover隐藏一下
     * 此方法属于骚操作
     * 因为登录按钮属于Popover子元素,正常点击弹窗后Popover不消失
     * 于是利用Popover的visible属性先隐藏,再去掉visible属性
     */
    handleOnClickLogin = () => {
        this.setState({ popoverVisible: false }, () => {
            this.setState({ popoverVisible: undefined });
        });
    }

    handleOnVisibleChange = (visible) => {
        const { historyOnce } = this.state;
        const { userInfo } = this.props;
        if (userInfo?.pk && visible && !historyOnce) {
            this.setState({ historyOnce: true }, () => {
                this.props.getBrowseHistory();
            });
        }
    }

    /** 渲染历史记录卡片 */
    renderHistoryPopover = () => {
        const { dateList, historyByDate } = this.props;
        const today = moment();
        const dateStrings = {
            [today.format('YYYY.MM.DD')]: '今天',
            [today.subtract('day', 1).format('YYYY.MM.DD')]: '昨天',
        };
        return (
            <div className={styles['user-history-popover']}>
                <Scrollbars autoHide={true} autoHideTimeout={500}>
                    {dateList?.map((date, i) => {
                        const str = moment(date).format('YYYY.MM.DD');
                        return (
                            <div className={styles['history-date']} key={i}>
                                <h4>{dateStrings[str] || str}</h4>
                                {historyByDate[date]?.map((record, j) => (
                                    <div className={styles.record} key={j}>
                                        <ContentElement source={record} />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </Scrollbars>
            </div>
        );
    }

    renderEmptyPopover = () => {
        const { userInfo } = this.props;
        return (
            <div className={styles['empty-popover']}>
                <img className={styles.bg} src={require('Public/images/default_view.png')} />
                <div className={styles.text}>您还没有观看记录</div>
                {!userInfo?.pk &&
                    <div className={styles['btn-open-login']}>
                        <LoginBtn onClick={this.handleOnClickLogin} />
                    </div>
                }
            </div>
        );
    }

    render() {
        const { popoverVisible } = this.state;
        const { dateList } = this.props;
        return (
            <div className={styles['user-history']}>
                <Popover
                    trigger='hover'
                    placement='bottomRight'
                    content={dateList?.length > 0 ? this.renderHistoryPopover() : this.renderEmptyPopover()}
                    onVisibleChange={this.handleOnVisibleChange}
                    getPopupContainer={(e) => e.parentElement}
                    {...(popoverVisible === undefined ? {} : { visible: popoverVisible })}
                >
                    <Button className={styles['btn-history']} shape='round'>
                        <Icon type='clock-circle' theme='filled' />看过
                    </Button>
                </Popover>
            </div>
        );
    }
}

export default History;
