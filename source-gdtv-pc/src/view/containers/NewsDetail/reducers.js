import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { formatEntity } from 'Utils/utils';

import { message } from 'antd';
import * as ActionTypes from './actions';

const initialState = fromJS({
    isPrefetch: false,
    isRequesting: false,
    newsContent: {},
    channelInfo: {},
    classificationName: '',
    columnInfo: {},

    // Articles|Gallery
    relateNews: [],
    // Video
    recommendNews: [],
    moreRecommendNews: {},

    // Tv
    columnVideo: [],
    moreColumnVideo: {},
});

const NewsDetail = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_NEWS_CONTENT.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_NEWS_CONTENT.SUCCESS:
            if (action.response.content) {
                action.response.helmetContent = action.response.content.replace(/<[^><]+>/g, '').substring(0, 36);
            }
            return state
                .set('newsContent', fromJS(action.response))
                .set('isRequesting', false);
        case ActionTypes.GET_NEWS_CONTENT.FAILURE:
            message.error('很抱歉，您查看的内容已下架');
            return state.set('isRequesting', false);

        case ActionTypes.GET_CHANNEL_INFO.SUCCESS:
            return state.set('channelInfo', fromJS(action.response));

        case ActionTypes.GET_RECENTLY_NEWS_LIST.SUCCESS:
            return state.set('relateNews', fromJS(action.response.responseList));

        case ActionTypes.GET_RECOMMEND_LIST.SUCCESS:
            return state
                .set('recommendNews', fromJS(action.response.list))
                .set('classificationName', action.response.name);

        case ActionTypes.GET_MORE_LIST.SUCCESS:
            action.response.list.forEach(item => {
                formatEntity(item);
            });
            return state.set('moreRecommendNews', fromJS(action.response));

        case ActionTypes.GET_COLUMN_VIDEO_LIST.SUCCESS: {
            const list = action.response.list || [];
            list.forEach(item => {
                formatEntity(item);
            });

            return state
                .set('columnVideo', fromJS(list))
                .set('classificationName', action.response.name);
        }

        case ActionTypes.GET_COLUMN_INFO.SUCCESS: {
            const res = action.response;
            return state
                .set('columnInfo', fromJS(res))
                .set('classificationName', action.response.name);
        }

        case ActionTypes.GET_MORE_COLUMN_VIDEO_LIST.SUCCESS:
            action.response.list.forEach(item => {
                formatEntity(item);
            });
            return state.set('moreColumnVideo', fromJS(action.response));

        case ActionTypes.LEAVE_PAGE:
            return initialState;
        default:
            return state;
    }
};

export default combineReducers({
    NewsDetail
});
