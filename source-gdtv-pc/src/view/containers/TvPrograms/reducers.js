import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';

import * as ActionTypes from './actions';

const tvProgramsInitialState = fromJS({
    isRequesting: false,
    // 电视频道
    tvChannels: [],
    // 电视频道下栏目Map
    tvChannelsColumn: {},
    // 广播频道
    broadcastChannels: [], 
    // 广播频道下栏目Map
    broadcastChannelsColumn: {},
});

const tvPrograms = (state = tvProgramsInitialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_TV_CHANNEL.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_TV_CHANNEL.SUCCESS:
            return state
                .set('tvChannels', fromJS(action.response))
                .set('isRequesting', false);
        case ActionTypes.GET_TV_CHANNEL.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_TV_COLUMN.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_TV_COLUMN.SUCCESS: {
            const { data, response } = action;
            const { tvChannelPk } = data.data;
            return state
                .setIn(['tvChannelsColumn', tvChannelPk], response.tvColumnList)
                .set('isRequesting', false);
        }
        case ActionTypes.GET_TV_COLUMN.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_BROADCAST_CHANNEL.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_BROADCAST_CHANNEL.SUCCESS:
            return state
                .set('broadcastChannels', fromJS(action.response))
                .set('isRequesting', false);
        case ActionTypes.GET_BROADCAST_CHANNEL.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_BROADCAST_COLUMN.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_BROADCAST_COLUMN.SUCCESS: {
            const { data, response } = action;
            const { tvChannelPk } = data.data;
            return state
                .setIn(['broadcastChannelsColumn', tvChannelPk], response.tvColumnList)
                .set('isRequesting', false);
        }
        case ActionTypes.GET_BROADCAST_COLUMN.FAILURE:
            return state.set('isRequesting', false);

        default:
            return state;
    }
};

export default tvPrograms;
