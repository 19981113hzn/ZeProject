import moment from 'moment';
import {
    put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services/index';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

// 获取视频详情
function* getTvChannelDetail(args) {
    try {
        let tcdn = '';
        try {
            const { node } = yield call(Api.getTcdnNode);
            tcdn = window.btoa(node);
        } catch (error) {
            //
        }
        const data = {
            tvChannelPk: args.data.tvChannelPk,
            node: tcdn
        };
        const res = yield call(Api.getTvChannelDetail, data);
        yield put(ActionTypes.getTvChannelDetail.success(args, res));

        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.name, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.slogan
        }));
        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getTvChannelDetail.failure(args, error));
    }
}

function* getTvChannelList(args) { // 获取频道列表
    try {
        const res = yield call(Api.getTvChannelList, { category: 0 });
        yield put(ActionTypes.getTvChannelList.success(args, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getTvChannelList.failure(args, error));
    }
}

function* getTvMenuList(args) { // 获取左侧展示列表
    try {
        const data = {
            ...args.data,
            endAt: moment().add(3, 'days').format('YYYY-MM-DD'),
            beginAt: moment().subtract(3, 'days').format('YYYY-MM-DD'),
        };
        const res = yield call(Api.getTvMenuList, data);
        yield put(ActionTypes.getTvMenuList.success(args, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getTvMenuList.failure(args, error));
    }
}

function* getTvColumn(args) { // 获取更多精彩
    try {
        const res = yield call(Api.getTvColumn, args.data);
        yield put(ActionTypes.getTvColumn.success(args, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getTvColumn.failure(args, error));
    }
}

export default function* TvLivePrefetch(args) {
    const { pathName = '' } = args;
    const [, , tvChannelPk] = pathName.split('/');

    yield fork(getTvChannelDetail, { data: { tvChannelPk } });
    yield fork(getTvChannelList);
    yield fork(getTvMenuList, { data: { tvChannelPk } });
    yield fork(getTvColumn, { data: { tvChannelPk } });
}
