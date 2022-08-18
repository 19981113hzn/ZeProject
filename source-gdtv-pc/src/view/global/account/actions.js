import { apiAction, action } from 'Utils/actionUtils';

const Module = 'ACCOUNT';

export const { getImgVerificationCode, GET_IMG_VERIFICATION_CODE } = apiAction('GET_IMG_VERIFICATION_CODE', Module);

export const { loginByPassword, LOGIN_BY_PASSWORD } = apiAction('LOGIN_BY_PASSWORD', Module);

export const { loginByCode, LOGIN_BY_CODE } = apiAction('LOGIN_BY_CODE', Module);

export const { loginByThirdParty, LOGIN_BY_THIRD_PARTY } = apiAction('LOGIN_BY_THIRD_PARTY', Module);

export const { register, REGISTER } = apiAction('REGISTER', Module);

export const { getVerificationCode, GET_VERIFICATION_CODE } = apiAction('GET_VERIFICATION_CODE', Module);

export const { getUserInfo, GET_USER_INFO } = apiAction('GET_USER_INFO', Module);

export const { updateUserInfo, UPDATE_USER_INFO } = apiAction('UPDATE_USER_INFO', Module);

export const { getBrowseHistory, GET_BROWSE_HISTORY } = apiAction('GET_BROWSE_HISTORY', Module);

export const SET_USER_INFO = 'SET_USER_INFO';
export const setUserInfo = (data) => action(SET_USER_INFO, { data });

export const SET_USER_INFO_FROM_STORE = 'SET_USER_INFO_FROM_STORE';
export const setUserInfoFromStore = (data) => action(SET_USER_INFO_FROM_STORE, { data });

export const LOGOUT = 'LOGOUT';
export const logout = () => action(LOGOUT);
