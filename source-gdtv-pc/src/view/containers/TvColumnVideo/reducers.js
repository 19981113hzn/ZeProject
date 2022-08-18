import { fromJS } from 'immutable';
import { ENTITY_KEY, formatEntity } from 'Utils/utils';

import * as ActionTypes from './actions';

const initialState = fromJS({
    isPrefetch: false,
    isRequesting: false,
    videoDetail: {},
    columnVideoList: [],
    relativeIsRequesting: false,
    relateNews: [],
    beginScore: 0,
    nameText: ''
});

const TvColumnVideo = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_COLUMN_VIDEO_LIST.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_COLUMN_VIDEO_LIST.SUCCESS: {
            const list = action.response.list || [];
            list.forEach(item => {
                formatEntity(item);
            });
            const [firstItem] = list;
            return state
                .set('videoDetail', fromJS(firstItem[ENTITY_KEY]))
                .set('nameText', action.response.name)
                .set('columnVideoList', fromJS(list))
                .set('beginScore', action.response.lastScore)
                .set('isRequesting', false);
        }
        case ActionTypes.GET_COLUMN_VIDEO_LIST.FAILURE:
            return state.set('isRequesting', false);


        case ActionTypes.GET_RECOMMEND_LIST.REQUEST:
            return state.set('relativeIsRequesting', true);
        case ActionTypes.GET_RECOMMEND_LIST.SUCCESS:
            return state
                .set('relateNews', fromJS(action.response.list))
                .set('beginScore', action.response.lastScore)
                .set('relativeIsRequesting', false);
        case ActionTypes.GET_RECOMMEND_LIST.FAILURE:
            return state.set('relativeIsRequesting', false);

        case ActionTypes.SET_VIDEO_DETAIL:
            return state.set('videoDetail', fromJS(action.data));

        case ActionTypes.LEAVE_PAGE:
            return initialState;
        default:
            return state;
    }
};

export default TvColumnVideo;
