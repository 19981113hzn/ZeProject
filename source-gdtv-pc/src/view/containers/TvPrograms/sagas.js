import {
    takeEvery, takeLatest, put, call, fork, cancel, race
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';

/** 获取电视频道列表 */
function* getTvChannel(action) {
    try {
        const tvChannels = yield call(Api.getTvChannelList, { statusList: '1,2', category: 0 });
        yield put(ActionTypes.getTvChannel.success(action, tvChannels));
        for (let i = 0; i < tvChannels.length; i += 1) {
            const { pk } = tvChannels[i];
            const data = {
                tvChannelPk: pk
            };
            yield put(ActionTypes.getTvColumn.request(data));
        }
    } catch (error) {
        yield put(ActionTypes.getTvChannel.failure(action, error));
    }
}

/** 获取广播频道列表 */
function* getBroadcastChannel(action) {
    try {
        const broadcastChannels = yield call(Api.getBroadcastChannelList, { statusList: '1,2', category: 1 });
        yield put(ActionTypes.getBroadcastChannel.success(action, broadcastChannels));
        for (let i = 0; i < broadcastChannels.length; i += 1) {
            const { pk } = broadcastChannels[i];
            const data = {
                tvChannelPk: pk
            };
            yield put(ActionTypes.getBroadcastColumn.request(data));
        }
    } catch (error) {
        yield put(ActionTypes.getBroadcastChannel.failure(action, error));
    }
}

/** 获取电视栏目列表 */
function* getTvColumn(action) {
    try {
        const res = yield call(Api.getTvColumn, action.data);
        yield put(ActionTypes.getTvColumn.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getTvColumn.failure(action, error));
    }
}

/** 获取广播栏目列表 */
function* getBroadcastColumn(action) {
    try {
        const res = yield call(Api.getBroadcastColumn, action.data);
        yield put(ActionTypes.getBroadcastColumn.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getBroadcastColumn.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_TV_CHANNEL.REQUEST, getTvChannel);
    yield takeEvery(ActionTypes.GET_TV_COLUMN.REQUEST, getTvColumn);
    yield takeLatest(ActionTypes.GET_BROADCAST_CHANNEL.REQUEST, getBroadcastChannel);
    yield takeEvery(ActionTypes.GET_BROADCAST_COLUMN.REQUEST, getBroadcastColumn);
}

export default function* TvPrograms() {
    yield fork(watchAll);
}
