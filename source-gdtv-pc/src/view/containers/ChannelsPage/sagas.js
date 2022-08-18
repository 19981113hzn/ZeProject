import {
    takeEvery, takeLatest, put, call, fork
} from 'redux-saga/effects';
import { DISPLAY_TYPE_COUNT } from 'Constants/type';

import * as Api from 'Services';
import * as ActionTypes from './actions';

/**
 * 获取频道信息
 * @param {*} action 
 */
function* getChannelInfo(action) {
    try {
        const res = yield call(Api.getChannelInfo, action.data);
        yield put(ActionTypes.getChannelInfo.success(action, res));
        yield put(ActionTypes.getAllSubChannelNews.request({ channelInfo: res }));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getChannelInfo.failure(action, error));
        action.reject && action.reject(error);
    }
}

/** 获得子频道列表下的新闻 */
function* getAllSubChannelNews(action) {
    try {
        const { channelInfo } = action.data;
        const { pk, childChannels = [], displayType } = channelInfo;
        if (childChannels && childChannels.length) {
            for (let i = 0; i < childChannels.length; i += 1) {
                const child = childChannels[i];
                const data = {
                    beginScore: 0,
                    channelId: child.pk,
                    pageSize: DISPLAY_TYPE_COUNT[displayType]
                };
                yield put(ActionTypes.getChannelNews.request(data));
            }
        } else {
            const data = {
                channelId: pk,
                pageSize: DISPLAY_TYPE_COUNT[displayType]
            };
            yield put(ActionTypes.getChannelNews.request(data));
        }
    } catch (error) {
        console.log(error);
    }
}

/** 获得频道新闻列表 */
function* getChannelNews(action) {
    try {
        const { beginScore = 0, channelId, pageSize = 8 } = action.data;
        let res = yield call(Api.getChannelNews, { beginScore, channelId, pageSize });
        const { list = [] } = res;
        // 避免点击“换一批”后没数据显示，数据需要循环显示
        if (list?.length == 0 && beginScore != 0) {
            res = yield put(ActionTypes.getChannelNews.request({ beginScore: 0, channelId, pageSize }));
        } else {
            yield put(ActionTypes.getChannelNews.success(action, res));
        }
    } catch (error) {
        yield put(ActionTypes.getChannelNews.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_CHANNEL_INFO.REQUEST, getChannelInfo);
    yield takeLatest(ActionTypes.GET_ALL_SUB_CHANNEL_NEWS.REQUEST, getAllSubChannelNews);
    yield takeEvery(ActionTypes.GET_CHANNEL_NEWS.REQUEST, getChannelNews);
}

export default function* HomePage() {
    yield fork(watchAll);
}
