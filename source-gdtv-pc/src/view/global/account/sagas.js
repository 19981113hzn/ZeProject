import {
    put, call, fork, takeLatest
} from 'redux-saga/effects';

import userUtils from 'Utils/userUtils';
import * as Api from 'Services/index';
import * as ActionTypes from './actions';

/** 密码登录 */
function* loginByPassword(action) {
    try {
        const res = yield call(Api.loginByPassword, action.data);
        yield put(ActionTypes.loginByPassword.success(action, res));
        yield put(ActionTypes.setUserInfo(res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.loginByPassword.failure(action, err));
        action.reject && action.reject(err);
    }
}

/** 获取图片验证码 */
function* getImgVerificationCode(action) {
    try {
        const res = yield call(Api.getImgVerificationCode, action.data);
        yield put(ActionTypes.getImgVerificationCode.success(action, res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.getImgVerificationCode.failure(action, err));
        action.reject && action.reject(err);
    }
}

/** 验证码登录 */
function* loginByCode(action) {
    try {
        const res = yield call(Api.loginByCode, action.data);
        yield put(ActionTypes.loginByCode.success(action, res));
        yield put(ActionTypes.setUserInfo(res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.loginByCode.failure(action, err));
        action.reject && action.reject(err);
    }
}

/** 注册 */
function* register(action) {
    try {
        const res = yield call(Api.register, action.data);
        yield put(ActionTypes.register.success(action, res));
        yield put(ActionTypes.setUserInfo(res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.register.failure(action, err));
        action.reject && action.reject(err);
    }
}

/** 获取短信验证码 */
function* getVerificationCode(action) {
    try {
        const res = yield call(Api.getVerificationCode, action.data);
        yield put(ActionTypes.getVerificationCode.success(action, res));
        yield put(ActionTypes.setUserInfo(res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.getVerificationCode.failure(action, err));
        action.reject && action.reject(err);
    }
}

/** 第三方登录 */
function* loginByThirdParty(action) {
    try {
        const res = yield call(Api.loginByThirdParty, action.data);
        yield put(ActionTypes.loginByThirdParty.success(action, res));
        yield put(ActionTypes.setUserInfo(res));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.loginByThirdParty.failure(action, err));
        action.reject && action.reject(err);
    }
}


/** 获取用户信息 */
function* getUserInfo(action) {
    try {
        const { pk } = userUtils.getUser();
        const data = { pk };
        const res = yield call(Api.getUserInfo, data);
        yield put(ActionTypes.getUserInfo.success(action, res));
        yield put(ActionTypes.setUserInfo(res));
    } catch (err) {
        yield put(ActionTypes.getUserInfo.failure(action, err));
    }
}

/** 修改用户信息 */
function* updateUserInfo(action) {
    try {
        const { pk } = userUtils.getUser();
        const data = {
            pk,
            ...action.data
        };
        const res = yield call(Api.updateUserInfo, data);
        yield put(ActionTypes.updateUserInfo.success(action, res));
        yield put(ActionTypes.setUserInfoFromStore(data));
        action.resolve && action.resolve(res);
    } catch (err) {
        yield put(ActionTypes.updateUserInfo.failure(action, err));
        action.reject && action.reject(err);
    }
}

function* getBrowseHistory(action) {
    try {
        const res = yield call(Api.getBrowseHistory, action.data);
        yield put(ActionTypes.getBrowseHistory.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getBrowseHistory.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.LOGIN_BY_PASSWORD.REQUEST, loginByPassword);
    yield takeLatest(ActionTypes.GET_IMG_VERIFICATION_CODE.REQUEST, getImgVerificationCode);
    yield takeLatest(ActionTypes.LOGIN_BY_CODE.REQUEST, loginByCode);
    yield takeLatest(ActionTypes.LOGIN_BY_THIRD_PARTY.REQUEST, loginByThirdParty);
    yield takeLatest(ActionTypes.REGISTER.REQUEST, register);
    yield takeLatest(ActionTypes.GET_VERIFICATION_CODE.REQUEST, getVerificationCode);
    yield takeLatest(ActionTypes.GET_USER_INFO.REQUEST, getUserInfo);
    yield takeLatest(ActionTypes.UPDATE_USER_INFO.REQUEST, updateUserInfo);
    yield takeLatest(ActionTypes.GET_BROWSE_HISTORY.REQUEST, getBrowseHistory);
}

export default function* accountSaga() {
    yield fork(watchAll);
}
