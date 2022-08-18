import {
    put, call, fork, takeLatest
} from 'redux-saga/effects';

import * as Api from 'Services/index';
import * as ActionTypes from './actions';

/** 获取首页banner */
function* getBannerFocus(action = {}) {
    try {
        const res = yield call(Api.getChannelFocus, { channelPk: -1 });

        yield put(ActionTypes.getBannerFocus.success(action.data, res));
    } catch (err) {
        yield put(ActionTypes.getBannerFocus.failure(action.data, err));
    }
}

function* getCommonChannel(action = {}) {
    try {
        const res = yield call(Api.getCommonChannel);

        yield put(ActionTypes.getCommonChannel.success(action.data, res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.getCommonChannel.failure(action.data, err));
        action.reject && action.reject(err);
    }
}

function* getFriendlyLinks(action) {
    try {
        const res = yield call(Api.getFriendlyLinks);
        yield put(ActionTypes.getFriendlyLinks.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getFriendlyLinks.failure(action, error));
    }
}

function* addNewsCount(action) {
    try {
        const res = yield call(Api.addNewsCount, action.data);
        yield put(ActionTypes.addNewsCount.success(action, res));
    } catch (error) {
        yield put(ActionTypes.addNewsCount.failure(action, error));
    }
}

function* incrReadCount(action) {
    try {
        yield call(Api.incrReadCount, action.data);
    } catch (error) {
        console.log(error);
    }
}

/** 获取分类导航栏 */
function* getHeaderOperation(action) {
    try {
        const res = yield call(Api.getChannelOperation, { channelPk: '-3' });
        yield put(ActionTypes.getHeaderOperation.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getHeaderOperation.failure(action, error));
    }
}

/** 获取底部栏 */
function* getFooterOperation(action) {
    try {
        const res = yield call(Api.getChannelOperation, { channelPk: '-4' });
        yield put(ActionTypes.getFooterOperation.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getFooterOperation.failure(action, error));
    }
}

function* getUploadToken(action) {
    try {
        const res = yield call(Api.getUploadToken, action.data);
        yield put(ActionTypes.getUploadToken.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getUploadToken.failure(action, error));
        action.reject && action.reject(error);
    }
}

/* 获取运营位广告 */
function* getChannelOperationAd(action) {
    try {
        const res = yield call(Api.getChannelOperationAd);
        yield put(ActionTypes.getChannelOperationAd.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getChannelOperationAd.failure(action, error));
    }
}

/* 广告记录埋点 */
function* addInnerAdCount(action) {
    yield call(Api.addInnerAdCount, action.data);
}

/* 前后贴片视频 */
function* getPreAfterAd(action) {
    try {
        const res = yield call(Api.getPreAfterAd, action.data);
        yield put(ActionTypes.getPreAfterAd.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getPreAfterAd.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_BANNER_FOCUS.REQUEST, getBannerFocus);
    yield takeLatest(ActionTypes.GET_COMMON_CHANNEL.REQUEST, getCommonChannel);
    yield takeLatest(ActionTypes.GET_FRIENDLY_LINKS.REQUEST, getFriendlyLinks);
    yield takeLatest(ActionTypes.GET_HEADER_OPERATION.REQUEST, getHeaderOperation);
    yield takeLatest(ActionTypes.GET_FOOTER_OPERATION.REQUEST, getFooterOperation);
    yield takeLatest(ActionTypes.ADD_NEWS_COUNT.REQUEST, addNewsCount);
    yield takeLatest(ActionTypes.GET_UPLOAD_TOKEN.REQUEST, getUploadToken);
    yield takeLatest(ActionTypes.GET_CHANNEL_OPERATION_AD.REQUEST, getChannelOperationAd);
    yield takeLatest(ActionTypes.ADD_INNER_AD_COUNT.REQUEST, addInnerAdCount);
    yield takeLatest(ActionTypes.GET_PRE_AFTER_AD.REQUEST, getPreAfterAd);
    yield takeLatest(ActionTypes.INCR_READ_COUNT.REQUEST, incrReadCount);
}

export default function* globalSaga() {
    yield fork(watchAll);
}
