import { createSelector } from 'reselect';

const globalSelector = (state) => state.get('global');
const accountSelector = (state) => state.get('account');
const homeSelector = (state) => state.get('HomePage');

export default createSelector(
    [globalSelector, accountSelector, homeSelector],
    (global, account, home) => ({
        isPrefetch: global.get('prefetch').get('isPrefetch'),
        root: global.get('root'),

        screenSize: global.get('root').get('screenSize'),
        friendlyLinks: global.get('root').get('friendlyLinks').toJS(),
        channelList: global.get('root').get('channelList').toJS(),
        bannerList: global.get('root').get('bannerList').toJS(),
        navList: global.get('root').get('navList').toJS(),
        footerNavList: global.get('root').get('footerNavList').toJS(),
        uploadToken: global.get('uploadToken').toJS(),
        channelOperationAd: global.get('root').get('channelOperationAd'),
        userInfo: account.get('userInfo'),
    })
);
