import React, { Component } from 'react';
import { connect } from 'react-redux';

// actions
import * as AccountActions from 'Global/account/actions';
import * as Actions from 'Global/actions';
import selectors from 'Global/selectors';

// components
import Footer from 'Components/Footer';
import Header from 'Components/Header';
import HeaderBanner from 'Components/HeaderBanner';

import userUtils from 'Utils/userUtils';
import { getScreenRange } from 'Utils/tools';
import { DISPLAY_ROUTE } from 'Components/HeaderBanner/constants';


// css
import styles from './index.less';
import { toJson } from '../../utils/utils';

/**
 * PageName: 页面框架
 *
 * Author: zhuhuishao
 * use: [ 页面基础框架 ]
 *
 */
@connect(selectors, {
    setUserInfo: AccountActions.setUserInfo,
    setScreenSize: Actions.setScreenSize,
    getBannerFocus: Actions.getBannerFocus.request,
    getCommonChannel: Actions.getCommonChannel.request,
    getFriendlyLinks: Actions.getFriendlyLinks.request,
    getHeaderOperation: Actions.getHeaderOperation.request,
    getFooterOperation: Actions.getFooterOperation.request,
    getChannelOperationAd: Actions.getChannelOperationAd.request,
    addInnerAdCount: Actions.addInnerAdCount.request
})
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.scrollbars = undefined;
    }

    componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getChannelOperationAd();
            this.props.getCommonChannel();
            this.props.getFriendlyLinks();
            this.props.getHeaderOperation();
            this.props.getFooterOperation();
        }
        if (userUtils.getUser()) {
            this.props.setUserInfo(userUtils.getUser());
        }

        const { history } = this.props;
        const { pathname } = history?.location || {};
        if (DISPLAY_ROUTE[0].includes(pathname)) {
            this.props.getBannerFocus();
        }

        this.handleOnResize();
        window.addEventListener('resize', this.handleOnResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleOnResize);
    }

    handleOnResize = () => {
        const { screenSize } = this.props;
        const range = getScreenRange();
        const sizeStr = Object.keys(range).reduce((result, key) => (range[key] ? key : result), '');
        if (screenSize != sizeStr) {
            this.props.setScreenSize({ size: sizeStr });
        }
    }

    render() {
        const {
            children,
            history,
            bannerList,
            friendlyLinks,
            navList,
            footerNavList,
            channelOperationAd
        } = this.props;

        const { topBanner = [] } = channelOperationAd;
        const _bannerList = bannerList.concat(topBanner.map(item => {
            const { web } = toJson(item.images);
            item.coverUrl = web;
            item.appearOffset = item.waitSecond;
            item.disappearOffset = item.playSecond;
            return item;
        }));
        return (
            <div className='global-page-layout'>
                <div className={styles['page-layout']} style={{ minHeight: '100vh' }}>
                    {_bannerList.length > 0 && <HeaderBanner
                        history={history}
                        bannerList={_bannerList}
                        addInnerAdCount={this.props.addInnerAdCount}
                        key={_bannerList.length}/>}
                    <Header history={history} channelList={navList} />
                    <div className={styles['page-container']}>
                        {children}
                    </div>
                    <Footer footerNavList={footerNavList} friendlyLinks={friendlyLinks} />
                </div>
            </div>

        );
    }
}

export default Layout;
