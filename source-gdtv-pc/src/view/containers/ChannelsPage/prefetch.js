import { put, call, fork } from 'redux-saga/effects';
import { DISPLAY_TYPE_COUNT } from 'Constants/type';

import * as Api from 'Services';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

/**
 * 获取频道信息
 * @param {*} action 
 */
function* getChannelInfo(action) {
    try {
        const { id } = action.data;
        const res = yield call(Api.getChannelInfo, { channelPk: id });
        yield put(ActionTypes.getChannelInfo.success(action, res));

        yield put(GlobalActionTypes.seoSet({
            metaTitle: [res.name, '荔枝网'].filter(Boolean).join('-'),
            metaKeywords: res.keyword && JSON.parse(res.keyword).join(','),
            metaDescription: res.description
        }));
        yield call(getAllSubChannelNews, { data: { channelInfo: res } });

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        console.log(error);
        yield put(ActionTypes.getChannelInfo.failure(action, error));
    }
}

/** 获得子频道列表下的新闻 */
function* getAllSubChannelNews(action) {
    try {
        const { channelInfo } = action.data;
        const { childChannels = [], displayType } = channelInfo;
        for (let i = 0; i < childChannels.length; i += 1) {
            const child = childChannels[i];
            const data = {
                beginScore: 0,
                channelId: child.pk,
                pageSize: DISPLAY_TYPE_COUNT[displayType]
            };
            yield call(getChannelNews, { data });
        }

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        console.log(error);
    }
}

function* getChannelNews(action) {
    try {
        const res = yield call(Api.getChannelNews, action.data);
        // 避免点击“换一批”后没数据显示，数据需要循环显示
        if (res.list.length == 0 && action.data.beginScore != 0) {
            yield call(getChannelNews, { data: { ...action.data, beginScore: 0 } });
        } else {
            yield put(ActionTypes.getChannelNews.success(action, res));
        }
    } catch (error) {
        yield put(ActionTypes.getChannelNews.failure(action, error));
    }
}

export default function* ChannelsPagePrefetch(args) {
    const { pathName = '' } = args;
    const [, , id] = pathName.split('/');

    yield fork(getChannelInfo, { data: { id } });
}
