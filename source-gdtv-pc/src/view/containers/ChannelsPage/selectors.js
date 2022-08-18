import { createSelector } from 'reselect';

const channelsSelector = (state) => state.get('ChannelsPage');
const globalSelector = (state) => state.get('global');

export default createSelector([channelsSelector, globalSelector], (channels, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),
    channelList: global.get('root').get('channelList').toJS(),
    screenSize: global.get('root').get('screenSize'),
    isRequesting: channels.get('isRequesting'),
    channelRequesting: channels.get('channelRequesting'),
    channelInfo: channels.get('channelInfo').toJS(),
    channelNews: channels.get('channelNews').toJS(),
}));
