import {
    put, call, fork
} from 'redux-saga/effects';
import { DISPLAY_TYPE_COUNT } from 'Constants/type';

import * as Api from 'Services';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

function* getSeoConfig(action) {
    try {
        const res = yield call(Api.getSeoConfig);
        yield put(ActionTypes.getSeoConfig.success(action, res));

        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.title, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword,
            metaDescription: res.description
        }));
        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getSeoConfig.failure(action, error));
    }
}

/** 获得频道焦点图 */
function* getChannelFocus(action) {
    try {
        const res = yield call(Api.getChannelFocus, { channelPk: 0 });
        yield put(ActionTypes.getChannelFocus.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getChannelFocus.failure(action, error));
    }
}

/** 获得热点新闻列表 */
function* getHotNews(args) {
    try {
        const res = yield call(Api.getHotNews);
        yield put(ActionTypes.getHotNews.success(args, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getHotNews.failure(args, error));
    }
}

/** 获得滚动新闻 */
function* getRollNews(action) {
    try {
        const res = yield call(Api.getRollNews);
        yield put(ActionTypes.getRollNews.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getRollNews.failure(action, error));
    }
}

/** 获得首页显示的频道列表 */
function* getHomeShowChannels(args) {
    try {
        const res = yield call(Api.getHomeShowChannels);
        yield put(ActionTypes.getHomeShowChannels.success(args, res));
        for (let i = 0; i < res.length; i += 1) {
            const { pk, childChannels = [], displayType } = res[i];
            const data = { beginScore: 0 };
            if (childChannels.length > 0) {
                const [child] = childChannels;
                data.channelId = child.pk;
                data.pageSize = DISPLAY_TYPE_COUNT[child.displayType];
            } else {
                data.channelId = pk;
                data.pageSize = DISPLAY_TYPE_COUNT[displayType];
            }
            yield call(getChannelNews, { data });
        }

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getHomeShowChannels.failure(args, error));
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

export default function* HomePagePrefetch(args) {
    yield fork(getSeoConfig, args);
    yield fork(getHotNews, args);
    yield fork(getRollNews, args);
    yield fork(getHomeShowChannels, args);
    yield fork(getChannelFocus, args);
}
