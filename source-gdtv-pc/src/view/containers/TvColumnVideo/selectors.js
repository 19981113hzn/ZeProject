import { createSelector } from 'reselect';

const columnDetailSelector = (state) => state.get('TvColumnVideo');
const globalSelector = (state) => state.get('global');

export default createSelector([columnDetailSelector, globalSelector], (columnDetail, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),

    isRequesting: columnDetail.get('isRequesting'),
    columnVideoList: columnDetail.get('columnVideoList').toJS(),
    relateNews: columnDetail.get('relateNews').toJS(),
    beginScore: columnDetail.get('lastScore'),
    videoDetail: columnDetail.get('videoDetail').toJS(),
    nameText: columnDetail.get('nameText'),
}));
