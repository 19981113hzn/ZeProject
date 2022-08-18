/* eslint-disable */
import { fromJS } from 'immutable';

import * as ActionTypes from './actions';

const initialState = fromJS({
	isPrefetch: false,
	isRequesting: false,
	liveDetail: {},
	moreLive: {},
	mediaLive: [],
	liveContent: [],
	liveScore: 0
});

const LiveRoom = (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.GET_LIVE.REQUEST:
			return state.set('isRequesting', true);
		case ActionTypes.GET_LIVE.SUCCESS:
			return state
				.set('liveDetail', fromJS(action.response))
				.set('isRequesting', false);
		case ActionTypes.GET_LIVE.FAILURE:
			return state.set('isRequesting', false);
		case ActionTypes.GET_RECENTLY_LIVE.SUCCESS:
			return state.set('moreLive', fromJS(action.response));
		case ActionTypes.GET_MEDIA_LIVE.SUCCESS:
			return state.set('mediaLive', fromJS(action.response?.items || []));
		case ActionTypes.GET_LIVE_CONTENT.SUCCESS:

			const {lastScore: _lastScore} = action.data.data

			const { resultList = [], lastScore } = action.response

			const liveContent = state.get('liveContent').toJS()

			const liveScore = state.get('liveScore')

			const data = _lastScore === 0 ? resultList: [...liveContent, ...resultList]

			return state
				.set('liveScore', Math.max(liveScore, lastScore))
				.set('liveContent', fromJS(data));
		case ActionTypes.LEAVE_PAGE:
			return initialState;
		default:
			return state;
	}
};

export default LiveRoom;
