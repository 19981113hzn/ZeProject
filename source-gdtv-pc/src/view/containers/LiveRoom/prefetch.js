import {
    put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

function* getLive(action) {
    try {
        const { id } = action.data;
        const res = yield call(Api.getLive, { id });
        yield put(ActionTypes.getLive.success(action, res));
        yield call(liveCount, {
            id,
            countType: 'readCount'
        });

        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.title, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.desc
        }));
    } catch (error) {
        yield put(ActionTypes.getLive.failure(action, error));
    }
}

function* liveCount(action) {
    try {
        const res = yield call(Api.liveCount, action.data);
        yield put(ActionTypes.liveCount.success(action, res));
    } catch (error) {
        yield put(ActionTypes.liveCount.failure(action, error));
    }
}

export default function* LiveRoomPrefetch(args) {
    const { pathName = '' } = args;
    const [, , id] = pathName.split('/');

    yield fork(getLive, { data: { id } });
}
