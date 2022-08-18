import {
    takeLatest, put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';

/** 获取直播间信息 */
function* getLive(action) {
    try {
        const { id } = action.data;
        const res = yield call(Api.getLive, { id });
        yield put(ActionTypes.getLive.success(action, res));
        yield put(ActionTypes.liveCount.request({
            id,
            countType: 'readCount'
        }));
        switch (+res.status) {
            case 5:
            case 9:
                yield put(ActionTypes.getRecentlyLive.request({
                    beginScore: 0,
                    pageSize: 10
                }));
                break;
            case 6:
                break;
            default:
                break;
        }
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getLive.failure(action, error));
        action.reject && action.reject(error);
    }
}

// 获取直播厅内容
function* getLiveContent(action) {
    try {
        const res = yield call(Api.getLiveContent, action.data);
        yield put(ActionTypes.getLiveContent.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        console.log('error', error);
        yield put(ActionTypes.getLiveContent.failure(action, error));
    }
}

/** 获取最新更新直播 */
function* getRecentlyLive(action) {
    try {
        const res = yield call(Api.getRecentlyLive, action.data);
        yield put(ActionTypes.getRecentlyLive.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getRecentlyLive.failure(action, error));
    }
}

/** 增加直播统计量 */
function* liveCount(action) {
    try {
        const res = yield call(Api.liveCount, action.data);
        yield put(ActionTypes.liveCount.success(action, res));
    } catch (error) {
        yield put(ActionTypes.liveCount.failure(action, error));
    }
}

/** 获取图文直播内容 */
function* getMediaLive(action) {
    try {
        const res = yield call(Api.getMediaLive, action.data);
        yield put(ActionTypes.getMediaLive.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getMediaLive.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_LIVE.REQUEST, getLive);
    yield takeLatest(ActionTypes.GET_RECENTLY_LIVE.REQUEST, getRecentlyLive);
    yield takeLatest(ActionTypes.LIVE_COUNT.REQUEST, liveCount);
    yield takeLatest(ActionTypes.GET_MEDIA_LIVE.REQUEST, getMediaLive);
    yield takeLatest(ActionTypes.GET_LIVE_CONTENT.REQUEST, getLiveContent);
}

export default function* LiveRoom() {
    yield fork(watchAll);
}
