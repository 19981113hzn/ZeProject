import {
    put, call, fork 
} from 'redux-saga/effects';

import * as Api from 'Services/index';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

function* getNewsTopic(args) {
    try {
        const res = yield call(Api.getNewsContent);
        yield put(ActionTypes.getNewsTopic.success(args, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getNewsTopic.failure(args, error));
    }
}


export default function* TopicDetailPrefetch(args) {
    yield fork(getNewsTopic, args);
}
