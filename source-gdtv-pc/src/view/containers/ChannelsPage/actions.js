import { apiAction, action } from 'Utils/actionUtils';

const Module = 'ALL_CHANNEL_PAGE';

export const { getChannelInfo, GET_CHANNEL_INFO } = apiAction('GET_CHANNEL_INFO', Module);

export const { getAllSubChannelNews, GET_ALL_SUB_CHANNEL_NEWS } = apiAction('GET_ALL_SUB_CHANNEL_NEWS', Module);

export const { getChannelNews, GET_CHANNEL_NEWS } = apiAction('GET_CHANNEL_NEWS', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
