import { apiAction, action } from 'Utils/actionUtils';

const Module = 'HOME_PAGE';

export const { getSeoConfig, GET_SEO_CONFIG } = apiAction('GET_SEO_CONFIG', Module);

export const { getHotNews, GET_HOT_NEWS } = apiAction('GET_HOT_NEWS', Module);

export const { getHomeShowChannels, GET_HOME_SHOW_CHANNELS } = apiAction('GET_HOME_SHOW_CHANNELS', Module);

export const { getChannelFocus, GET_CHANNEL_FOCUS } = apiAction('GET_CHANNEL_FOCUS', Module);

export const { getChannelNews, GET_CHANNEL_NEWS } = apiAction('GET_CHANNEL_NEWS', Module);

export const { getRollNews, GET_ROLL_NEWS } = apiAction('GET_ROLL_NEWS', Module);


export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
