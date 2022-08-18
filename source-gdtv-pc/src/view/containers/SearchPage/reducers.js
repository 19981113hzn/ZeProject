import * as R from 'ramda';
import { fromJS } from 'immutable';

import * as ActionTypes from './actions';

/**
 * 合并两个对象的自身属性（不包括 prototype 属性）。
 * 如果某个 key 在两个对象中都存在：
 * 并且两个关联的值都是对象，则继续递归合并这两个值。
 * 否则，使用给定函数对该 key 和对应的两个值进行处理，并将返回值作为该 key 的新值。
 * @param {*} k 
 * @param {*} l 
 * @param {*} r 
 */
const rule = (k, l, r) => (k === 'list' ? R.concat(l, r) : r);
const mergeWith = (l, r) => R.mergeDeepWithKey(rule, l, r);

const initialState = fromJS({
    isPrefetch: false,
    isRequesting: false,
    // 剧集
    series: {},
    // 电视节目
    tvColumns: {},
    // 专题
    topics: {},
    // 新闻
    newsItems: {}
});

const SearchPage = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SEARCH_NEWS.REQUEST:
            return state.set('isRequesting', true);
        case ActionTypes.SEARCH_NEWS.SUCCESS: {
            const {
                series,
                tvColumns,
                topics,
                newsItems
            } = action.response;
            return state
                .set('isRequesting', false)
                .set('series', fromJS(mergeWith(state.get('series').toJS(), series || {})))
                .set('tvColumns', fromJS(mergeWith(state.get('tvColumns').toJS(), tvColumns || {})))
                .set('topics', fromJS(mergeWith(state.get('topics').toJS(), topics || {})))
                .set('newsItems', fromJS(mergeWith(state.get('newsItems').toJS(), newsItems || {})));
        }
        case ActionTypes.SEARCH_NEWS.FAILURE:
            return state.set('isRequesting', false);

        case ActionTypes.LEAVE_PAGE:
            return initialState;
        default:
            return state;
    }
};

export default SearchPage;
