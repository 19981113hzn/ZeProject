import { createSelector } from 'reselect';

const topicSelector = (state) => state.get('TopicDetail');
const globalSelector = (state) => state.get('global');

export default createSelector([topicSelector, globalSelector], (topic, global) => ({
    isPrefetch: global.get('prefetch').get('isPrefetch'),
    screenSize: global.get('root').get('screenSize'),

    newsTopicDetail: topic.get('newsTopicDetail').toJS(),
    newsTopicColumn: topic.get('newsTopicColumn').toJS(),
    total: topic.get('total'),
    topicMemberList: topic.get('topicMemberList').toJS(),
    newsTopicMemberList: topic.get('newsTopicMemberList').toJS(),
    channelNewsList: topic.get('channelNewsList').toJS()
}));
