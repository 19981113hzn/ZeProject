import {
    takeLatest, put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';

function* getColumnVideoList(action) {
    try {
        const res = yield call(Api.getColumnVideoList, action.data);
        yield put(ActionTypes.getColumnVideoList.success(action, res));
        yield put(ActionTypes.getRecommendList.request({
            tvColumnPk: action.data.tvColumnPk,
            beginScore: res.lastScore,
            pageSize: 24,
        }));
    } catch (error) {
        yield put(ActionTypes.getColumnVideoList.failure(action, error));
    }
}

function* getRecommendList(action) {
    try {
        const res = yield call(Api.getColumnVideoList, action.data);
        yield put(ActionTypes.getRecommendList.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getRecommendList.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_COLUMN_VIDEO_LIST.REQUEST, getColumnVideoList);
    yield takeLatest(ActionTypes.GET_RECOMMEND_LIST.REQUEST, getRecommendList);
}

export default function* TvColumnVideo() {
    yield fork(watchAll);
}
