import { apiAction, action } from 'Utils/actionUtils';

const Module = 'SEARCH_PAGE';

export const { searchNews, SEARCH_NEWS } = apiAction('SEARCH_NEWS', Module);

export const LEAVE_PAGE = 'LEAVE_PAGE';
export const leavePage = () => action(LEAVE_PAGE);
