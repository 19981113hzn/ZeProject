import { createSelector } from 'reselect';

const searchSelector = (state) => state.get('SearchPage');
const globalSelector = (state) => state.get('global');

export default createSelector(
    [searchSelector, globalSelector],
    (search, global) => ({
        screenSize: global.get('root').get('screenSize'),
        isPrefetch: global.get('prefetch').get('isPrefetch'),

        isRequesting: search.get('isRequesting'),
        series: search.get('series').toJS(),
        tvColumns: search.get('tvColumns').toJS(),
        topics: search.get('topics').toJS(),
        newsItems: search.get('newsItems').toJS(),
        total: [
            search.get('series').toJS(),
            search.get('tvColumns').toJS(),
            search.get('topics').toJS(),
            search.get('newsItems').toJS()
        ].reduce((count, item) => count + (item?.total || 0), 0)
    })
);
