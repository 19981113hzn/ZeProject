import { createSelector } from 'reselect';

const TvLiveSelector = (state) => state.get('TvLive');
const globalSelector = (state) => state.get('global');

export default createSelector([TvLiveSelector, globalSelector], (TvLive, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),

    tvChannelDetail: TvLive.get('tvChannelDetail').toJS(),
    tvChannelList: TvLive.get('tvChannelList').toJS(),
    tvMenuList: TvLive.get('tvMenuList').toJS(),
    dateLiveMenu: TvLive.get('dateLiveMenu').toJS(),
    allMenuList: TvLive.get('allMenuList').toJS(),
    tvColumn: TvLive.get('tvColumn').toJS(),
}));
