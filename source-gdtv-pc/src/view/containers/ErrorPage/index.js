import React from 'react';
import HelmetSEO from 'Components/HelmetSEO';

import styles from './index.less';

/**
 * PageName: 404
 * 
 * Author: zhuhuishao 
 * use: [ 错误访问跳转页面 ]
 * 
*/
class ErrorPage extends React.Component {
    componentDidMount() {
        document.body.style.backgroundColor = '#fff';
    }

    render() {
        return (
            <div>
                <HelmetSEO title='404' />
                <div className={styles['erro-bg']}></div>
                <p className={styles.tips}>糟糕！页面飘走了~<a href="/">返回首页</a></p>
            </div>
        );
    }
}

export default ErrorPage;
