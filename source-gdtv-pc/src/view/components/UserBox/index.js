import React, { Component } from 'react';
import { Button } from 'antd';

import Account from './components/Account';
import History from './components/History';

import styles from './index.less';

/**
 * ModuleName: 用户登录
 * 
 * Author: xuchunhua 
 * use: [ 用户登录信息展示 ]
 */
class UserBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    render() {
        return (
            <div className={styles['user-wrap']}>
                <History />
                <Account />
            </div>
        );
    }
}

export default UserBox;
