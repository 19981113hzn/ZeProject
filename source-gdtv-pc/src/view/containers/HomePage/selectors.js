import { createSelector } from 'reselect';

const homeSelector = (state) => state.get('HomePage');
const globalSelector = (state) => state.get('global');

export default createSelector([homeSelector, globalSelector], (home, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),
    screenSize: global.get('root').get('screenSize'),
    friendlyLinks: global.get('root').get('friendlyLinks').toJS(),
    navList: global.get('root').get('navList').toJS(),
    homeCommon: home.get('homeCommon').toJS(),
    homeChannels: home.get('homeChannels').toJS(),
    hotNews: home.get('hotNews').toJS(),
    focus: home.get('focus').toJS(),
    channelOperationAd: global.get('root').get('channelOperationAd')
}));
