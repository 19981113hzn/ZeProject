import { apiAction, action } from 'Utils/actionUtils';

const Module = 'TV_PROGRAMS_PAGE';

export const { getTvChannel, GET_TV_CHANNEL } = apiAction('GET_TV_CHANNEL', Module);

export const { getTvColumn, GET_TV_COLUMN } = apiAction('GET_TV_COLUMN', Module);


export const { getBroadcastChannel, GET_BROADCAST_CHANNEL } = apiAction('GET_BROADCAST_CHANNEL', Module);

export const { getBroadcastColumn, GET_BROADCAST_COLUMN } = apiAction('GET_BROADCAST_COLUMN', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
