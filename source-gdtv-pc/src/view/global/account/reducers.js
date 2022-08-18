import { fromJS } from 'immutable';
import moment from 'moment';
import userUtils from 'Utils/userUtils';
import * as actionTypes from './actions';

const initialState = fromJS({
    isRequesting: false,
    userInfo: {},
    // 有历史记录的日期
    dateList: [],
    // 所有历史记录已排序按天归类
    historyByDate: {}
});

const Account = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_INFO:
            userUtils.saveUser(action.data);
            return state.set('userInfo', { ...state.get('userInfo'), ...action.data });
        case actionTypes.SET_USER_INFO_FROM_STORE:
            return state.set('userInfo', { ...state.get('userInfo'), ...action.data });

        case actionTypes.LOGOUT:
            userUtils.logout();
            return state
                .set('dateList', [])
                .set('historyByDate', {})
                .set('userInfo', {});

        case actionTypes.LOGIN_BY_PASSWORD.REQUEST:
            return state.set('isRequesting', true);
        case actionTypes.LOGIN_BY_PASSWORD.SUCCESS:
            return state.set('isRequesting', false);
        case actionTypes.LOGIN_BY_PASSWORD.FAILURE:
            return state.set('isRequesting', false);

        case actionTypes.LOGIN_BY_CODE.REQUEST:
            return state.set('isRequesting', true);
        case actionTypes.LOGIN_BY_CODE.SUCCESS:
            return state.set('isRequesting', false);
        case actionTypes.LOGIN_BY_CODE.FAILURE:
            return state.set('isRequesting', false);

        case actionTypes.LOGIN_BY_THIRD_PARTY.REQUEST:
            return state.set('isRequesting', true);
        case actionTypes.LOGIN_BY_THIRD_PARTY.SUCCESS:
            return state.set('isRequesting', false);
        case actionTypes.LOGIN_BY_THIRD_PARTY.FAILURE:
            return state.set('isRequesting', false);

        case actionTypes.GET_BROWSE_HISTORY.SUCCESS: {
            const historyByDate = {};
            const dateList = action.response.reduce((total, curr) => {
                const date = moment(curr.recentVisitTime).startOf('date').valueOf();
                if (!historyByDate[date]) {
                    historyByDate[date] = [];
                    total.push(date);
                }
                historyByDate[date].push(curr);
                return total;
            }, []);
            return state
                .set('dateList', dateList)
                .set('historyByDate', historyByDate);
        }

        default:
            return state;
    }
};

export default Account;
