import { createSelector } from 'reselect';

const tvProgramsSelector = (state) => state.get('TvPrograms');
const globalSelector = (state) => state.get('global');

export default createSelector([tvProgramsSelector, globalSelector], (tvPrograms, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),
    screenSize: global.get('root').get('screenSize'),

    isRequesting: tvPrograms.get('isRequesting'),
    tvChannels: tvPrograms.get('tvChannels').toJS(),
    tvChannelsColumn: tvPrograms.get('tvChannelsColumn').toJS(),
    broadcastChannels: tvPrograms.get('broadcastChannels').toJS(),
    broadcastChannelsColumn: tvPrograms.get('broadcastChannelsColumn').toJS()

}));
