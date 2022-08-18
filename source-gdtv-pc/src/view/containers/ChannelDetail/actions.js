import { apiAction, action } from 'Utils/actionUtils';

const Module = 'TV_COLUMN';

export const { getColumnInfo, GET_COLUMN_INFO } = apiAction('GET_COLUMN_INFO', Module);

export const { getColumnVideoList, GET_COLUMN_VIDEO_LIST } = apiAction('GET_COLUMN_VIDEO_LIST', Module);

export const { getChannelInfo, GET_CHANNEL_INFO } = apiAction('GET_CHANNEL_INFO', Module);

export const { getChannelNews, GET_CHANNEL_NEWS } = apiAction('GET_CHANNEL_NEWS', Module);
