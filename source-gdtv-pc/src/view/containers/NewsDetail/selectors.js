import { createSelector } from 'reselect';

const newsSelector = (state) => state.get('NewsDetail');
const globalSelector = (state) => state.get('global');

export default createSelector([newsSelector, globalSelector], (news, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),

    newsContent: news.get('NewsDetail').get('newsContent').toJS(),
    channelInfo: news.get('NewsDetail').get('channelInfo').toJS(),
    classificationName: news.get('NewsDetail').get('classificationName'),
    relateNews: news.get('NewsDetail').get('relateNews').toJS(),
    recommendNews: news.get('NewsDetail').get('recommendNews').toJS(),
    moreRecommendNews: news.get('NewsDetail').get('moreRecommendNews').toJS(),
    columnVideo: news.get('NewsDetail').get('columnVideo').toJS(),
    moreColumnVideo: news.get('NewsDetail').get('moreColumnVideo').toJS(),

    columnInfo: news.get('NewsDetail').get('columnInfo').toJS()
}));
