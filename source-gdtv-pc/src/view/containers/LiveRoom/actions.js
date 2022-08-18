import { apiAction, action } from 'Utils/actionUtils';

const Module = 'LIVE_ROOM';

export const { getLive, GET_LIVE } = apiAction('GET_LIVE', Module);

export const { getRecentlyLive, GET_RECENTLY_LIVE } = apiAction('GET_RECENTLY_LIVE', Module);

export const { getMediaLive, GET_MEDIA_LIVE } = apiAction('GET_MEDIA_LIVE', Module);

export const { getLiveContent, GET_LIVE_CONTENT } = apiAction('GET_LIVE_CONTENT', Module);

export const { liveCount, LIVE_COUNT } = apiAction('LIVE_COUNT', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
