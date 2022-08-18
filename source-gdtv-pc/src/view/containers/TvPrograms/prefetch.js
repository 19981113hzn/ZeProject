import {
    put, call, fork
} from 'redux-saga/effects';
import moment from 'moment';

import * as Api from 'Services';
import * as GlobalActionTypes from 'Global/actions';
import * as ActionTypes from './actions';

const format = 'YYYY-MM-DD HH:mm:ss';

function* getTvChannel(action) {
    try {
        const tvChannels = yield call(Api.getTvChannelList, { statusList: '1,2', category: 0 });
        yield put(ActionTypes.getTvChannel.success(action, tvChannels));
        for (let i = 0; i < tvChannels.length; i += 1) {
            const { pk } = tvChannels[i];
            const data = {
                tvChannelPk: pk,
                beginAt: moment().startOf('day').format(format),
                endAt: moment().endOf('day').format(format)
            };
            yield call(getTvColumn, { data });
        }
        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.getTvChannel.failure(action, error));
    }
}

function* getTvColumn(action) {
    try {
        const res = yield call(Api.getTvColumn, action.data);
        yield put(ActionTypes.getTvColumn.success(action, res));
    } catch (error) {
        yield put(ActionTypes.getTvColumn.failure(action, error));
    }
}

export default function* TvProgramsPrefetch(args) {
    yield fork(getTvChannel, args);
}
