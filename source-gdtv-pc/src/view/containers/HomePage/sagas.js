import {
    takeEvery, takeLatest, put, call, fork, cancel, race
} from 'redux-saga/effects';
import { DISPLAY_TYPE_COUNT } from 'Constants/type';

import * as Api from 'Services';
import * as ActionTypes from './actions';

function* getSeoConfig(action) {
    try {
        const res = yield call(Api.getSeoConfig);
        yield put(ActionTypes.getSeoConfig.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getSeoConfig.failure(action, error));
    }
}

/** 获得频道焦点图 */
function* getChannelFocus(action) {
    try {
        const res = yield call(Api.getChannelFocus, { channelPk: 0 });
        yield put(ActionTypes.getChannelFocus.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getChannelFocus.failure(action, error));
    }
}

/** 获得热点新闻列表 */
function* getHotNews(action) {
    try {
        const res = yield call(Api.getHotNews);
        yield put(ActionTypes.getHotNews.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getHotNews.failure(action, error));
    }
}

/** 获得滚动新闻 */
function* getRollNews(action) {
    try {
        const res = yield call(Api.getRollNews);
        yield put(ActionTypes.getRollNews.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getRollNews.failure(action, error));
    }
}

/** 获得首页显示的频道列表 */
function* getHomeShowChannels(action) {
    try {
        const res = yield call(Api.getHomeShowChannels);
        yield put(ActionTypes.getHomeShowChannels.success(action, res));
        for (let i = 0; i < res.length; i += 1) {
            const { pk, childChannels = [], displayType } = res[i];
            const data = {
                beginScore: 0,
                pageSize: DISPLAY_TYPE_COUNT[displayType]
            };
            if (childChannels.length > 0) {
                const [child] = childChannels;
                data.channelId = child.pk;
            } else {
                data.channelId = pk;
            }
            yield put(ActionTypes.getChannelNews.request(data));
        }
    } catch (error) {
        yield put(ActionTypes.getHomeShowChannels.failure(action, error));
    }
}

/** 获得频道新闻列表 */
function* getChannelNews(action) {
    try {
        const res = yield call(Api.getChannelNews, action.data);
        yield put(ActionTypes.getChannelNews.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getChannelNews.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_SEO_CONFIG.REQUEST, getSeoConfig);
    yield takeLatest(ActionTypes.GET_CHANNEL_FOCUS.REQUEST, getChannelFocus);
    yield takeLatest(ActionTypes.GET_HOT_NEWS.REQUEST, getHotNews);
    yield takeLatest(ActionTypes.GET_ROLL_NEWS.REQUEST, getRollNews);
    yield takeLatest(ActionTypes.GET_HOME_SHOW_CHANNELS.REQUEST, getHomeShowChannels);
    yield takeEvery(ActionTypes.GET_CHANNEL_NEWS.REQUEST, getChannelNews);
}

export default function* HomePage() {
    yield fork(watchAll);
}
