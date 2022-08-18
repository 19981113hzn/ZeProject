import {
    put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services/index';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

function* getColumnVideoList(args) {
    try {
        const res = yield call(Api.getColumnVideoList, args.data);
        yield put(ActionTypes.getColumnVideoList.success(args, res));

        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.name, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.desc
        }));
        yield call(getRecommendList, {
            data: {
                tvColumnPk: args.data.tvColumnPk,
                beginScore: res.lastScore,
                pageSize: 24,
            }
        });
        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getColumnVideoList.failure(args, error));
    }
}

function* getRecommendList(action) {
    try {
        const res = yield call(Api.getColumnVideoList, action.data);
        yield put(ActionTypes.getRecommendList.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getRecommendList.failure(action, error));
    }
}

export default function* TvColumnVideoPrefetch(args) {
    const { pathName = '' } = args;
    const [, , tvColumnPk] = pathName.split('/');
    yield fork(getColumnVideoList, { data: { tvColumnPk } });
}
