import {
    takeEvery, takeLatest, put, call, fork, cancel, race
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';
import { PAGE_SIZE } from './constant';

/**
 * 获取栏目信息
 * @param {*} action
 */
function* getColumnInfo(action) {
    try {
        const res = yield call(Api.getColumnInfo, action.data);
        yield put(ActionTypes.getColumnInfo.success(action, res));
        yield put(ActionTypes.getColumnVideoList.request({
            tvColumnPk: res.pk,
            currentPage: 1,
            searchByTime: false,
            beginScore: 0
        }));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getColumnInfo.failure(action, error));
        action.reject && action.reject(error);
    }
}

/**
 * 获取栏目视频
 * @param {*} action
 */
function* getColumnVideoList(action) {
    try {
        const data = {
            pageSize: PAGE_SIZE,
            ...action.data
        };
        const res = yield call(Api.getColumnVideoList, data);
        yield put(ActionTypes.getColumnVideoList.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getColumnVideoList.failure(action, error));
    }
}

/**
 * 获取频道信息
 * @param {*} action
 */
function* getChannelInfo(action) {
    try {
        const res = yield call(Api.getChannelInfo, action.data);
        yield put(ActionTypes.getChannelInfo.success(action, res));
        yield call(getChannelNews, {
            data: {
                channelId: res.pk,
                currentPage: 1
            }
        });
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getChannelInfo.failure(action, error));
        action.reject && action.reject(error);
    }
}

/**
 * 获取频道视频
 * @param {*} action
 */
function* getChannelNews(action) {
    try {
        const data = {
            pageSize: PAGE_SIZE,
            ...action.data
        };
        const res = yield call(Api.getChannelNews, data);
        yield put(ActionTypes.getChannelNews.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getChannelNews.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_COLUMN_INFO.REQUEST, getColumnInfo);
    yield takeLatest(ActionTypes.GET_COLUMN_VIDEO_LIST.REQUEST, getColumnVideoList);
    yield takeLatest(ActionTypes.GET_CHANNEL_INFO.REQUEST, getChannelInfo);
    yield takeLatest(ActionTypes.GET_CHANNEL_NEWS.REQUEST, getChannelNews);
}

export default function* ChannelDetail() {
    yield fork(watchAll);
}
