import {
    takeEvery, takeLatest, put, call, fork, cancel, race
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';

/**
 * 基于关键字搜索
 * @param {*} action 
 */
function* searchNews(action) {
    try {
        const res = yield call(Api.searchNews, action.data);
        yield put(ActionTypes.searchNews.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.searchNews.failure(action, error));
        action.reject && action.reject(error);
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.SEARCH_NEWS.REQUEST, searchNews);
}

export default function* SearchPage() {
    yield fork(watchAll);
}
