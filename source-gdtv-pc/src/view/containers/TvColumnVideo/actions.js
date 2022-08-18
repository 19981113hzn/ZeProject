import { apiAction, action } from 'Utils/actionUtils';

const Module = 'TV_COLUMN_DETAIL';

export const { getColumnVideoList, GET_COLUMN_VIDEO_LIST } = apiAction('GET_COLUMN_VIDEO_LIST', Module);

export const { getRecommendList, GET_RECOMMEND_LIST } = apiAction('GET_RECOMMEND_LIST', Module);

export const SET_VIDEO_DETAIL = 'SET_VIDEO_DETAIL';
export const setVideoDetail = (data) => action(SET_VIDEO_DETAIL, { data });

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
