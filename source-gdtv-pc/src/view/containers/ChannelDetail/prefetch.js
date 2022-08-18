import {
    put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

import { PAGE_SIZE } from './constant';

/**
 * 获取栏目信息
 * @param {*} action 
 */
function* getColumnInfo(action) {
    try {
        const res = yield call(Api.getColumnInfo, action.data);
        yield put(ActionTypes.getColumnInfo.success(action, res));
        yield call(getColumnVideoList, {
            data: {
                tvColumnPk: res.pk,
                currentPage: 1,
                searchByTime: false
            }
        });

        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.name, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.desc
        }));
    } catch (error) {
        yield put(ActionTypes.getColumnInfo.failure(action, error));
    }
}

/**
 * 获取栏目视频
 * @param {*} action 
 */
function* getColumnVideoList(action) {
    try {
        const data = {
            pageSize: PAGE_SIZE,
            ...action.data
        };
        const res = yield call(Api.getColumnVideoList, data);
        yield put(ActionTypes.getColumnVideoList.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getColumnVideoList.failure(action, error));
    }
}

/**
 * 获取频道信息
 * @param {*} action 
 */
function* getChannelInfo(action) {
    try {
        const res = yield call(Api.getChannelInfo, action.data);
        yield put(ActionTypes.getChannelInfo.success(action, res));
        yield call(getChannelNews, {
            data: {
                channelId: res.pk,
                currentPage: 1
            }
        });
        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.name, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.desc
        }));
    } catch (error) {
        yield put(ActionTypes.getChannelInfo.failure(action, error));
        action.reject && action.reject(error);
    }
}

/**
 * 获取栏目视频
 * @param {*} action 
 */
function* getChannelNews(action) {
    try {
        const data = {
            pageSize: PAGE_SIZE,
            ...action.data
        };
        const res = yield call(Api.getChannelNews, data);
        yield put(ActionTypes.getChannelNews.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getChannelNews.failure(action, error));
    }
}

export default function* TvColumnPrefetch(args) {
    const { pathName = '' } = args;
    const [, path, id] = pathName.split('/');
    switch (path) {
        case 'tvColumn':
            yield fork(getColumnInfo, { data: { columnPk: id } });
            break;
        case 'channelDetail':
            yield fork(getChannelInfo, { data: { channelId: id } });
            break;
        default:
            break;
    }
}
