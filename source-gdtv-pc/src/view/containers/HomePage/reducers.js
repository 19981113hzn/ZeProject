import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { ENTITY_KEY, formatEntity } from 'Utils/utils';

import * as ActionTypes from './actions';

const homeCommonInitialState = fromJS({
    isRequesting: false,
    seoConfig: {},
});
const homeCommon = (state = homeCommonInitialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_SEO_CONFIG.SUCCESS:
            return state.set('seoConfig', action.response);
        default:
            return state;
    }
};

const homeChannelsInitialState = fromJS({
    isRequesting: false,
    channels: [],
    // 首页频道信息流Map，pk为key
    channelNews: {},
});

const homeChannels = (state = homeChannelsInitialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_HOME_SHOW_CHANNELS.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_HOME_SHOW_CHANNELS.SUCCESS:
            return state
                .set('channels', action.response)
                .set('isRequesting', false);
        case ActionTypes.GET_HOME_SHOW_CHANNELS.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_CHANNEL_NEWS.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_CHANNEL_NEWS.SUCCESS: {
            const { channelId } = action.data.data;
            const list = action.response.list || [];
            list.forEach(item => {
                formatEntity(item);
            });
            return state
                .setIn(['channelNews', channelId], list)
                .set('isRequesting', false);
        }
        case ActionTypes.GET_CHANNEL_NEWS.FAILURE:
            return state.set('isRequesting', false);

        default:
            return state;
    }
};

const hotNewsInitialState = fromJS({
    isRequesting: false,
    // 图片新闻
    pictrueNews: [],
    // 文字新闻
    textNews: [],
    // 滚动新闻
    rollNews: []
});

const hotNews = (state = hotNewsInitialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_HOT_NEWS.SUCCESS: {
            const { textNewsData = [], pictrueNewsData = [] } = action.response;
            const pictrueNews = (pictrueNewsData || [])
                .map(item => item.map(cur => formatEntity(cur)[ENTITY_KEY]));
            const textNews = (textNewsData || []).map(cur => cur.map((item) => {
                const data = formatEntity(item)[ENTITY_KEY];
                try {
                    data.titleStyle = JSON.parse(data.titleStyle);
                } catch (error) {
                    data.titleStyle = {};
                }
                return data;
            }));
            return state
                .set('textNews', textNews)
                .set('pictrueNews', pictrueNews);
        }

        case ActionTypes.GET_ROLL_NEWS.SUCCESS:
            return state.set('rollNews', action.response);

        default:
            return state;
    }
};

const focusInitialState = fromJS({
    isRequesting: false,
    focusList: []
});

const focus = (state = focusInitialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_CHANNEL_FOCUS.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_CHANNEL_FOCUS.SUCCESS: {
            const { channelFocusList } = action.response;
            channelFocusList.forEach((item) => {
                try {
                    const coverUrl = JSON.parse(item.coverUrl);
                    item.coverUrl = coverUrl.web;
                } catch (error) {
                    //
                }
            });
            return state
                .set('focusList', channelFocusList)
                .set('isRequesting', false);
        }
        case ActionTypes.GET_CHANNEL_FOCUS.FAILURE:
            return state.set('isRequesting', false);

        default:
            return state;
    }
};

export default combineReducers({
    homeCommon,
    homeChannels,
    hotNews,
    focus
});
