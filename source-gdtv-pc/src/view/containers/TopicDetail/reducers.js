import { fromJS } from 'immutable';
import * as R from 'ramda';
import { formatEntity } from 'Utils/utils';

import * as ActionTypes from './actions';

/**
 * 处理剧集列表数据
 */
const dataMenuFn = (list) => R.splitEvery(30)(list);

const initialState = fromJS({
    isPrefetch: false,
    isRequesting: false,
    newsTopicDetail: {},
    // 专题栏目
    newsTopicColumn: [],
    // 剧集总集数
    total: 0,
    topicMemberList: [],
    // 剧集分集
    newsTopicMemberList: [],
    // 更多精彩数据
    channelNewsList: [],
    channelNewsIsRequesting: false,
});

// eslint-disable-next-line consistent-return
const TopicDetail = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_NEWS_TOPIC.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_NEWS_TOPIC.SUCCESS:
            return state
                .set('newsTopicDetail', fromJS(action.response))
                .set('isRequesting', false);
        case ActionTypes.GET_NEWS_TOPIC.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_NEWS_TOPIC_COLUMN.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_NEWS_TOPIC_COLUMN.SUCCESS: {
            const newsTopicColumn = action.response
                .filter(_ => _.memberList?.length > 0)
                .map(_ => {
                    _.isDone = _.memberList?.length < action.data.data.pageSize;
                    return _;
                });
            return state
                .set('newsTopicColumn', fromJS(newsTopicColumn))
                .set('isRequesting', false);
        }
        case ActionTypes.GET_NEWS_TOPIC_COLUMN.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST.SUCCESS: {
            return state
                .set('newsTopicMemberList', fromJS(dataMenuFn(action.response)))
                .set('topicMemberList', fromJS(action.response))
                .set('total', action.response.length)
                .set('isRequesting', false);
        }

        case ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST_V2.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST_V2.SUCCESS: {
            try {
                const _newsTopicColumn = state.get('newsTopicColumn').toJS();
                const index = _newsTopicColumn.findIndex(item => item.id === action.data.data.topicId);
                _newsTopicColumn[index].memberList = _newsTopicColumn[index].memberList.concat(action.response.list || []);
                _newsTopicColumn[index].lastScore = action.response.lastScore;
                _newsTopicColumn[index].isDone = (action.response.list || [])?.length < action.data.data.pageSize;
                return state
                    .set('newsTopicColumn', fromJS(_newsTopicColumn))
                    .set('isRequesting', false);
            } catch (e) {
                console.log(e);
            }
            break;
        }

        case ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST.FAILURE:
            return state.set('isRequesting', false);
        case ActionTypes.GET_CHANNEL_NEWS_LIST.REQUEST:
            return state.set('channelNewsIsRequesting', true);
        case ActionTypes.GET_CHANNEL_NEWS_LIST.SUCCESS: {
            const list = action.response.list || [];
            list.forEach(item => {
                formatEntity(item);
            });
            return state
                .set('channelNewsList', fromJS(list))
                .set('channelNewsIsRequesting', false);
        }
        case ActionTypes.GET_CHANNEL_NEWS_LIST.FAILURE:
            return state.set('channelNewsIsRequesting', false);
        case ActionTypes.LEAVE_PAGE:
            return initialState;
        default:
            return state;
    }
};

export default TopicDetail;
