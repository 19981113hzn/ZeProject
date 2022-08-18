import React, { Component } from 'react';
import { Button, Icon } from 'antd';

import FastEntry from 'Components/FastEntry';
import SearchBox from 'Components/SearchBox';
import UserBox from 'Components/UserBox';
import responsiveStyles from 'Constants/style/responsive.less';

import { menu } from 'Components/NavBar/constants';
import styles from './index.less';

/**
 * ModuleName: 通用Header
 * 
 * Author: xuchunhua 
 * use: [ 页面通用Header展示 ]
 * 
 */
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrCodeVisible: false,
            loading: false,
            fixed: false,
            isIndex: false
        };
    }

    componentDidMount() {
        const { history } = this.props;
        const { pathname } = history.location;
        if (!pathname || pathname === '/' || pathname === '/index') {
            this.setState({ isIndex: true });
        }
        window.addEventListener('scroll', this.fixedBar);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.fixedBar);
    }

    // 监听固定悬浮导航栏
    fixedBar = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const fixed = scrollTop > 400;
        this.setState({ fixed });
    }

    handleBackToTop = () => {
        window.scrollTo(0, 0);
    }

    render() {
        const { fixed, isIndex } = this.state;
        const { channelList } = this.props;
        // 吸附顶部或非首页时true
        const fixedOrIndex = fixed || !isIndex;
        return (
            <div className={styles['header-container']}>
                <div
                    id='headerWarp'
                    className={[
                        styles['header-wrap'],
                        responsiveStyles.layout,
                        fixed && styles['header-fixed'] || '',
                        fixedOrIndex && styles['header-white'] || ''
                    ].join(' ')}
                >
                    <div className={[styles.header, responsiveStyles.content].join(' ')}>
                        <div className={styles['header-logo']}>
                            <a href='/' className={styles.logo} title='荔枝网'>荔枝网</a>
                        </div>
                        {fixedOrIndex &&
                            <div className={styles['header-channel']}>
                                <FastEntry title='分类' channelList={channelList} />
                            </div>
                        }
                        {fixedOrIndex &&
                            <div className={styles['header-nav']}>
                                {menu.map((item, j) => (
                                    <a key={j}
                                        className={styles['nav-bar-icon']}
                                        href={item.url}
                                        target={item.newBlank ? '_blank' : ''}
                                    >
                                        <div className={[styles['nav-bar-icon-cover'], item.className].join(' ')}>
                                            {item.name}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        }
                        <div className={styles['header-right']}>
                            <div className={styles['top-links-bar']}>
                                <UserBox {...this.props} />
                            </div>
                        </div>
                        <div className={styles['header-search']}>
                            <SearchBox opaque={fixedOrIndex} />
                        </div>
                    </div>
                </div>
                {fixed &&
                    <div className={styles['back-to-top']}>
                        <Button className={styles.btn} icon='up' shape='circle' onClick={this.handleBackToTop} />
                    </div>
                }
            </div >
        );
    }
}
