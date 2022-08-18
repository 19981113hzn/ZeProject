import { apiAction, action } from 'Utils/actionUtils';

const Module = 'TOPIC_DETAIL';

export const { getNewsTopic, GET_NEWS_TOPIC } = apiAction('GET_NEWS_TOPIC', Module);

export const { getNewsTopicColumn, GET_NEWS_TOPIC_COLUMN } = apiAction('GET_NEWS_TOPIC_COLUMN', Module);

export const { getNewsTopicMemberList, GET_NEWS_TOPIC_MEMBER_LIST } = apiAction('GET_NEWS_TOPIC_MEMBER_LIST', Module);

export const { getNewsTopicMemberListV2, GET_NEWS_TOPIC_MEMBER_LIST_V2 } = apiAction('GET_NEWS_TOPIC_MEMBER_LIST_V2', Module);

export const { getChannelNewsList, GET_CHANNEL_NEWS_LIST } = apiAction('GET_CHANNEL_NEWS_LIST', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
