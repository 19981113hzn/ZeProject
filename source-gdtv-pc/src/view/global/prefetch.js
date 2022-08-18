import {
    call, put, fork, takeLatest
} from 'redux-saga/effects';
import * as Api from 'Services/index';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

function* getCommonChannel(action) {
    try {
        const res = yield call(Api.getCommonChannel);
        yield put(ActionTypes.getCommonChannel.success(action, res));
        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (err) {
        yield put(ActionTypes.getCommonChannel.failure(action, err));
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

export function* addNewsCount(action) {
    try {
        const res = yield call(Api.addNewsCount, action.data);
        yield put(ActionTypes.addNewsCount.success(action, res));
    } catch (error) {
        yield put(ActionTypes.addNewsCount.failure(action, error));
    }
}

export default function* globalSaga(args) {
    yield fork(getCommonChannel, args);
    yield fork(getFriendlyLinks, args);
    yield fork(getHeaderOperation, args);
    yield fork(getFooterOperation, args);
}
