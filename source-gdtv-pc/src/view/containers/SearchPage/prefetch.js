import { urlParams } from 'Utils/utils';
import {
    put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';


/**
 * 基于关键字搜索
 * @param {*} action 
 */
function* searchNews(action) {
    try {
        const res = yield call(Api.searchNews, action.data);
        yield put(ActionTypes.searchNews.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.searchNews.failure(action, error));
    }
}

export default function* SearchPagePrefetch(args) {
    const { pathName = '' } = args;
    const { key = '' } = urlParams(pathName);
    yield fork(searchNews, { data: { key } });
}
