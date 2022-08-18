import { createSelector } from 'reselect';

const LiveRoomSelector = (state) => state.get('LiveRoom');
const globalSelector = (state) => state.get('global');

export default createSelector([LiveRoomSelector, globalSelector], (LiveRoom, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),

    liveDetail: LiveRoom.get('liveDetail').toJS(),

    moreLive: LiveRoom.get('moreLive').toJS(),

    mediaLive: LiveRoom.get('mediaLive').toJS(),

    liveContent: LiveRoom.get('liveContent').toJS(),

    liveScore: LiveRoom.get('liveScore'),
}));
