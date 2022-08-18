import {
    takeLatest, put, call, fork
} from 'redux-saga/effects';

import * as Api from 'Services';
import * as ActionTypes from './actions';

function* getNewsTopic(action) {
    try {
        const res = yield call(Api.getNewsTopic, action.data);
        yield put(ActionTypes.getNewsTopic.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getNewsTopic.failure(action, error));
    }
}

function* getNewsTopicColumn(action) {
    try {
        const res = yield call(Api.getNewsTopicColumn, action.data);
        yield put(ActionTypes.getNewsTopicColumn.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getNewsTopicColumn.failure(action, error));
        action.reject && action.reject(error);
    }
}

function* getNewsTopicMemberList(action) {
    try {
        const res = yield call(Api.getNewsTopicMemberList, action.data);
        yield put(ActionTypes.getNewsTopicMemberList.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getNewsTopicMemberList.failure(action, error));
        action.reject && action.reject(error);
    }
}

function* getNewsTopicMemberListV2(action) {
    try {
        const res = yield call(Api.getNewsTopicMemberListV2, action.data);
        yield put(ActionTypes.getNewsTopicMemberListV2.success(action, res));
        action.resolve && action.resolve(res);
    } catch (error) {
        yield put(ActionTypes.getNewsTopicMemberListV2.failure(action, error));
        action.reject && action.reject(error);
    }
}

function* getChannelNewsList(action) {
    try {
        const res = yield call(Api.getChannelNews, action.data);
        yield put(ActionTypes.getChannelNewsList.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getChannelNewsList.failure(action, error));
    }
}

function* watchAll() {
    yield takeLatest(ActionTypes.GET_NEWS_TOPIC.REQUEST, getNewsTopic);
    yield takeLatest(ActionTypes.GET_NEWS_TOPIC_COLUMN.REQUEST, getNewsTopicColumn);
    yield takeLatest(ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST.REQUEST, getNewsTopicMemberList);
    yield takeLatest(ActionTypes.GET_NEWS_TOPIC_MEMBER_LIST_V2.REQUEST, getNewsTopicMemberListV2);
    yield takeLatest(ActionTypes.GET_CHANNEL_NEWS_LIST.REQUEST, getChannelNewsList);
}

export default function* TopicDetail() {
    yield fork(watchAll);
}
