import { createSelector } from 'reselect';

const columnSelector = (state) => state.get('ChannelDetail');
const globalSelector = (state) => state.get('global');

export default createSelector(
    [columnSelector, globalSelector],
    (column, global) => ({
        isPrefetch: global.get('prefetch').get('isPrefetch'),
        screenSize: global.get('root').get('screenSize'),
        isRequesting: column.get('isRequesting'),
        hasMore: column.get('hasMore'),
        columnInfo: column.get('columnInfo').toJS(),
        columnVideoList: column.get('columnVideoList').toJS(),
        lastScore: column.get('lastScore')
    })
);
