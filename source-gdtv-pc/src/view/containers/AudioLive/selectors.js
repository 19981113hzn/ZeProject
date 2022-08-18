import { createSelector } from 'reselect';

const AudioLiveSelector = (state) => state.get('AudioLive');
const globalSelector = (state) => state.get('global');

export default createSelector([AudioLiveSelector, globalSelector], (AudioLive, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),
    tvChannelDetail: AudioLive.get('tvChannelDetail').toJS(),
    tvChannelList: AudioLive.get('tvChannelList').toJS(),
    tvMenuList: AudioLive.get('tvMenuList').toJS(),
    dateLiveMenu: AudioLive.get('dateLiveMenu').toJS(),
    allMenuList: AudioLive.get('allMenuList').toJS(),
    tvColumn: AudioLive.get('tvColumn').toJS(),
}));
