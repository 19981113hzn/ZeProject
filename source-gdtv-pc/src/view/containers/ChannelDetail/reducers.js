import { fromJS } from 'immutable';
import { formatEntity } from 'Utils/utils';

import * as ActionTypes from './actions';
import { PAGE_SIZE } from './constant';

const initialState = fromJS({
    isPrefetch: false,
    isRequesting: false,
    // 还有更多
    hasMore: true,
    columnInfo: {},
    columnVideoList: []
});

const ChannelDetail = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_COLUMN_INFO.REQUEST:
        case ActionTypes.GET_CHANNEL_INFO.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_COLUMN_INFO.SUCCESS:
        case ActionTypes.GET_CHANNEL_INFO.SUCCESS:
            return state
                .set('isRequesting', false)
                .set('columnInfo', fromJS(action.response));
        case ActionTypes.GET_COLUMN_INFO.FAILURE:
        case ActionTypes.GET_CHANNEL_INFO.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_COLUMN_VIDEO_LIST.REQUEST:
        case ActionTypes.GET_CHANNEL_NEWS.REQUEST:
            if (action.data && action.data.currentPage == 1) {
                return state
                    .set('isRequesting', true)
                    .set('columnVideoList', fromJS([]))
                    .set('hasMore', true);
            }
            return state.set('isRequesting', true);
        case ActionTypes.GET_COLUMN_VIDEO_LIST.SUCCESS:
        case ActionTypes.GET_CHANNEL_NEWS.SUCCESS: {
            const list = action.response.list || [];
            list.forEach((item) => {
                formatEntity(item);
            });
            return state
                .set('isRequesting', false)
                .set('lastScore', action.response.lastScore)
                .set('columnVideoList', fromJS([...state.get('columnVideoList'), ...list]))
                .set('hasMore', list.length >= PAGE_SIZE);
        }
        case ActionTypes.GET_COLUMN_VIDEO_LIST.FAILURE:
        case ActionTypes.GET_CHANNEL_NEWS.FAILURE:
            return state.set('isRequesting', false);

        default:
            return state;
    }
};

export default ChannelDetail;
