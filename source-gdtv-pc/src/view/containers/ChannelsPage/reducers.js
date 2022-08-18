import { fromJS } from 'immutable';
import { formatEntity } from 'Utils/utils';

import * as ActionTypes from './actions';

const allChannelsInitialState = fromJS({
    isRequesting: false,
    // 频道详情
    channelInfo: {},
    // Map子频道信息流，pk为key
    channelNews: {},
    channelRequesting: {},
});

const allChannels = (state = allChannelsInitialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_CHANNEL_INFO.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_CHANNEL_INFO.SUCCESS:
            return state
                .set('isRequesting', false)
                .set('channelInfo', fromJS(action.response));
        case ActionTypes.GET_CHANNEL_INFO.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_CHANNEL_NEWS.REQUEST:
            return state
                .setIn(['channelRequesting', action.data.channelId], true)
                .set('isRequesting', true);
        case ActionTypes.GET_CHANNEL_NEWS.SUCCESS: {
            const { data, response } = action;
            const { channelId } = data.data;
            response.list.forEach((item) => {
                formatEntity(item);
            });
            return state
                .setIn(['channelNews', channelId], response)
                .setIn(['channelRequesting', channelId], false)
                .set('isRequesting', false);
        }
        case ActionTypes.GET_CHANNEL_NEWS.FAILURE:
            return state
                .setIn(['channelRequesting', action.data.data.channelId], false)
                .set('isRequesting', false);

        default:
            return state;
    }
};

export default allChannels;
