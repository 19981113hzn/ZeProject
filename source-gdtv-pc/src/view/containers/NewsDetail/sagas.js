import {
    takeLatest, put, call, fork
} from 'redux-saga/effects';

import { NO_RELATIVE_ID } from 'Constants/hardCode';
import { NEWS_CONTENT_TYPE } from 'Constants/type';
import * as GlobalActions from 'Global/actions';
import * as Api from 'Services';
import * as ActionTypes from './actions';

function* getNewsContent(action) {
    try {
        const { sid } = action.data;
        const res = yield call(Api.getNewsContent, { sid });
        yield put(ActionTypes.getNewsContent.success(action, res));
        const { contentType, channelPK } = res;
        yield put(GlobalActions.addNewsCount.request({
            id: sid,
            countType: 'readCount'
        }));
        if (channelPK) {
            yield put(ActionTypes.getChannelInfo.request({ channelPk: channelPK }));
        }
        // 获取更多精彩
        switch (`${contentType}`) {
            case `${NEWS_CONTENT_TYPE.ARTICAL}`: // 图文
                yield put(ActionTypes.getRecentlyNewsList.request({
                    id: sid,
                    channelPk: res.channelPK || 1,
                    beginScore: 0,
                    pageSize: 6,
                    contentType
                }));
                break;
            case `${NEWS_CONTENT_TYPE.GALLERY}`: // 图集
                yield put(ActionTypes.getRecentlyNewsList.request({
                    id: sid,
                    channelPk: res.channelPK || 1,
                    beginScore: 0,
                    pageSize: 10,
                    contentType
                }));
                break;
            case `${NEWS_CONTENT_TYPE.TV}`: // 电视节目
            case `${NEWS_CONTENT_TYPE.AUDIO}`: // 电视节目
                yield put(ActionTypes.getColumnVideoList.request({
                    id: sid,
                    channelPk: res.channelPK || 1,
                    tvColumnPk: res.tvColumnPk || 1,
                    beginScore: 0,
                    pageSize: 10,
                }));
                break;
            case `${NEWS_CONTENT_TYPE.VIDEO}`: // 视频
            case `${NEWS_CONTENT_TYPE.SERIES}`: // 剧集
                yield put(ActionTypes.getRecommendList.request({
                    id: sid,
                    channelPk: res.channelPK || 1,
                    beginScore: 0,
                    pageSize: 10,
                }));
                break;
            default:
                break;
        }
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getNewsContent.failure(action, error));
        action.reject && action.reject(error);
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
        yield put(ActionTypes.getMoreList.request({
            id: action.data.id,
            channelPk: action.data.channelPk || 1,
            beginScore: res.lastScore,
            pageSize: 40,
        }));
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
        yield put(ActionTypes.getMoreColumnVideoList.request({
            id: action.data.id,
            tvColumnPk: action.data.tvColumnPk,
            beginScore: res.lastScore,
            pageSize: 40
        }));
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

/**
 * 获取频道信息
 * @param {*} action
 */
function* getChannelInfo(action) {
    try {
        const res = yield call(Api.getChannelInfo, action.data);
        yield put(ActionTypes.getChannelInfo.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getChannelInfo.failure(action, error));
        action.reject && action.reject(error);
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

function* watchAll() {
    yield takeLatest(ActionTypes.GET_NEWS_CONTENT.REQUEST, getNewsContent);
    yield takeLatest(ActionTypes.GET_CHANNEL_INFO.REQUEST, getChannelInfo);
    yield takeLatest(ActionTypes.GET_RECENTLY_NEWS_LIST.REQUEST, getRecentlyNewsList);
    yield takeLatest(ActionTypes.GET_RECOMMEND_LIST.REQUEST, getRecommendList);
    yield takeLatest(ActionTypes.GET_MORE_LIST.REQUEST, getMoreList);
    yield takeLatest(ActionTypes.GET_COLUMN_VIDEO_LIST.REQUEST, getColumnVideoList);
    yield takeLatest(ActionTypes.GET_MORE_COLUMN_VIDEO_LIST.REQUEST, getMoreColumnVideoList);
    yield takeLatest(ActionTypes.GET_COLUMN_INFO.REQUEST, getColumnInfo);
}

export default function* NewsDetail() {
    yield fork(watchAll);
}
