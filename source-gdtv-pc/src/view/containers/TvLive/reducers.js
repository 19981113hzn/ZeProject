import { fromJS } from 'immutable';
import moment from 'moment';
import { urlJSON } from 'Utils/utils';

import { WEEK_DAY } from './enum';
import * as ActionTypes from './actions';

function imageJSON(str) {
    if (typeof str == 'string') {
        try {
            const { logo, clogo } = JSON.parse(str);
            return logo || clogo;
        } catch (e) {
            return str;
        }
    }
    return '';
}

const initialState = fromJS({
    isPrefetch: false,
    isRequesting: false,
    tvChannelDetail: {},
    tvChannelList: [],
    tvMenuList: [],
    tvColumn: [],
    dateLiveMenu: [],
    // 全部节目单
    allMenuList: [],
});

const TvLive = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_TV_CHANNEL_DETAIL.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.GET_TV_CHANNEL_DETAIL.SUCCESS:
            action.response.playUrl = urlJSON(action.response.playUrl);
            action.response.avatarUrl = imageJSON(action.response.avatarUrl);
            return state
                .set('tvChannelDetail', fromJS(action.response))
                .set('isRequesting', false);
        case ActionTypes.GET_TV_CHANNEL_DETAIL.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.GET_TV_CHANNEL_LIST.SUCCESS:
            return state
                .set('tvChannelList', fromJS(action.response));

        case ActionTypes.GET_TV_MENU_LIST.SUCCESS: {
            const { resultList } = action.response;
            resultList.map(item => {
                item.weekDay = WEEK_DAY[moment(item.dateAt).format('e')];
                return item;
            });
            const allMenuList = resultList.reduce((list, item) => [...list, ...(item.tvMenus || [])], []);
            return state
                .set('allMenuList', fromJS(allMenuList))
                .set('tvMenuList', fromJS(resultList))
                .set('dateLiveMenu', fromJS(resultList));
        }

        case ActionTypes.GET_TV_COLUMN.SUCCESS:
            return state
                .set('tvColumn', fromJS(action.response && action.response.tvColumnList || []));

        case ActionTypes.LEAVE_PAGE:
            return initialState;
        default:
            return state;
    }
};

export default TvLive;
