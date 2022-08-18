import {
    put, call, fork
} from 'redux-saga/effects';

import { NO_RELATIVE_ID } from 'Constants/hardCode';
import { NEWS_CONTENT_TYPE } from 'Constants/type';
import * as Api from 'Services/index';
import * as GlobalActionTypes from 'Global/actions';
import { addNewsCount } from 'Global/prefetch';
import * as ActionTypes from './actions';

function* getNewsContent(action) {
    try {
        const { sid } = action.data;
        const res = yield call(Api.getNewsContent, { sid });
        yield put(ActionTypes.getNewsContent.success(action, res));
        const { contentType } = res;
        yield call(addNewsCount, {
            data: {
                id: sid,
                countType: 'readCount'
            }
        });
        switch (`${contentType}`) {
            case `${NEWS_CONTENT_TYPE.ARTICAL}`: // 图文
                yield call(getRecentlyNewsList, {
                    data: {
                        id: sid,
                        beginScore: 0,
                        pageSize: 6,
                        contentType
                    }
                });
                break;
            case `${NEWS_CONTENT_TYPE.GALLERY}`: // 图集
                yield call(getRecentlyNewsList, {
                    data: {
                        id: sid,
                        beginScore: 0,
                        pageSize: 10,
                        contentType
                    }
                });
                break;
            case `${NEWS_CONTENT_TYPE.TV}`: // 电视节目
                yield call(getColumnVideoList, {
                    data: {
                        tvColumnPk: res.tvColumnPk || 1,
                        beginScore: 0,
                        pageSize: 10
                    }
                });
                break;
            case `${NEWS_CONTENT_TYPE.VIDEO}`: // 视频
            case `${NEWS_CONTENT_TYPE.SERIES}`: // 剧集
                yield call(getRecommendList, {
                    data: {
                        id: sid,
                        channelPk: res.channelPK || 1,
                        beginScore: 0,
                        pageSize: 10
                    }
                });
                break;
            default:
                break;
        }
        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.title, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.summary
        }));
        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getNewsContent.failure(action, error));
    }
}

/** 获得新闻最新内容 */
function* getRecentlyNewsList(action) {
    try {
        const res = yield call(Api.getRecentlyNewsList, action.data);
        yield put(ActionTypes.getRecentlyNewsList.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getRecentlyNewsList.failure(action, error));
    }
}

/** 获取推荐内容 */
function* getRecommendList(action) {
    try {
        const res = yield call(Api.getRelateNewsList, action.data);
        yield put(ActionTypes.getRecommendList.success(action, res));
        yield call(getMoreList, {
            data: {
                id: action.data.id,
                channelPk: action.data.channelPk || 1,
                beginScore: res.lastScore,
                pageSize: 40
            }
        });
    } catch (error) {
        yield put(ActionTypes.getRecommendList.failure(action, error));
    }
}

/** 获取更多推荐内容 */
function* getMoreList(action) {
    if (NO_RELATIVE_ID.includes(action.data.id)) {
        return;
    }
    try {
        const res = yield call(Api.getRelateNewsList, action.data);
        yield put(ActionTypes.getMoreList.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getMoreList.failure(action, error));
    }
}

/** 获取电视节目 */
function* getColumnVideoList(action) {
    try {
        const res = yield call(Api.getColumnVideoList, action.data);
        yield put(ActionTypes.getColumnVideoList.success(action, res));
        yield call(getMoreColumnVideoList, {
            data: {
                tvColumnPk: action.data.tvColumnPk,
                beginScore: res.lastScore,
                pageSize: 40
            }
        });
    } catch (error) {
        yield put(ActionTypes.getColumnVideoList.failure(action, error));
    }
}

/** 获取更多电视节目 */
function* getMoreColumnVideoList(action) {
    try {
        const res = yield call(Api.getColumnVideoList, action.data);
        yield put(ActionTypes.getMoreColumnVideoList.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getMoreColumnVideoList.failure(action, error));
    }
}

/*
* 获取栏目信息
* */
function* getColumnInfo(action) {
    try {
        const res = yield call(Api.getColumnInfo, action.data);
        yield put(ActionTypes.getColumnInfo.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getColumnInfo.failure(action, error));
        action.reject && action.reject(error);
    }
}


export default function* NewsDetailPrefetch(args) {
    const { pathName = '' } = args;
    const [, , sid] = pathName.split('/');

    yield fork(getNewsContent, { data: { sid } });
}
