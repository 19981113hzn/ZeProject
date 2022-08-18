import { apiAction, action } from 'Utils/actionUtils';


const Module = 'AUDIO_CHANNEL_DETAIL';

export const { getTvChannelDetail, GET_TV_CHANNEL_DETAIL } = apiAction('GET_TV_CHANNEL_DETAIL', Module);

export const { getTvChannelList, GET_TV_CHANNEL_LIST } = apiAction('GET_TV_CHANNEL_LIST', Module);
export const { getTvMenuList, GET_TV_MENU_LIST } = apiAction('GET_TV_MENU_LIST', Module);
export const { getTvColumn, GET_TV_COLUMN } = apiAction('GET_TV_COLUMN', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
