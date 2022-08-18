import { apiAction, action } from 'Utils/actionUtils';

const Module = 'NEWS_DETAIL_PAGE';

export const { getNewsContent, GET_NEWS_CONTENT } = apiAction('GET_NEWS_CONTENT', Module);

export const { getChannelInfo, GET_CHANNEL_INFO } = apiAction('GET_CHANNEL_INFO', Module);

export const { getRecentlyNewsList, GET_RECENTLY_NEWS_LIST } = apiAction('GET_RECENTLY_NEWS_LIST', Module);

export const { getRecommendList, GET_RECOMMEND_LIST } = apiAction('GET_RECOMMEND_LIST', Module);

export const { getMoreList, GET_MORE_LIST } = apiAction('GET_MORE_LIST', Module);

export const { getColumnVideoList, GET_COLUMN_VIDEO_LIST } = apiAction('GET_COLUMN_VIDEO_LIST', Module);

export const { getMoreColumnVideoList, GET_MORE_COLUMN_VIDEO_LIST } = apiAction('GET_MORE_COLUMN_VIDEO_LIST', Module);

export const { getColumnInfo, GET_COLUMN_INFO } = apiAction('GET_COLUMN_INFO', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
