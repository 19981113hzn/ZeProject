import {
    takeLatest, put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';

function* getTvChannelDetail(action) { // 获取视频详情
    try {
        let tcdn = '';
        try {
            const { node } = yield call(Api.getTcdnNode);
            tcdn = window.btoa(node);
        } catch (error) {
            //
        }
        const data = {
            tvChannelPk: action.data.tvChannelPk,
            node: tcdn
        };
        const res = yield call(Api.getTvChannelDetail, data);
        yield put(ActionTypes.getTvChannelDetail.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getTvChannelDetail.failure(action, error));
    }
}

function* getTvChannelList(action) { // 获取频道列表
    try {
        const res = yield call(Api.getTvChannelList, action.data);
        yield put(ActionTypes.getTvChannelList.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getTvChannelList.failure(action, error));
        action.reject && action.reject(error);
    }
}

function* getTvMenuList(action) { // 获取左侧展示列表
    try {
        const res = yield call(Api.getTvMenuList, action.data);
        yield put(ActionTypes.getTvMenuList.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getTvMenuList.failure(action, error));
        action.reject && action.reject(error);
    }
}

function* getTvColumn(action) { // 获取更多精彩
    try {
        const res = yield call(Api.getTvColumn, action.data);
        yield put(ActionTypes.getTvColumn.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getTvColumn.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_TV_CHANNEL_DETAIL.REQUEST, getTvChannelDetail);
    yield takeLatest(ActionTypes.GET_TV_CHANNEL_LIST.REQUEST, getTvChannelList);
    yield takeLatest(ActionTypes.GET_TV_MENU_LIST.REQUEST, getTvMenuList);
    yield takeLatest(ActionTypes.GET_TV_COLUMN.REQUEST, getTvColumn);
}

export default function* TvLive() {
    yield fork(watchAll);
}
