import { apiAction, action } from 'Utils/actionUtils';

const Module = 'GLOBAL';

export const { getBannerFocus, GET_BANNER_FOCUS } = apiAction('GET_BANNER_FOCUS', Module);

export const { getCommonChannel, GET_COMMON_CHANNEL } = apiAction('GET_COMMON_CHANNEL', Module);

export const { getFriendlyLinks, GET_FRIENDLY_LINKS } = apiAction('GET_FRIENDLY_LINKS', Module);

export const { getHeaderOperation, GET_HEADER_OPERATION } = apiAction('GET_HEADER_OPERATION', Module);

export const { getFooterOperation, GET_FOOTER_OPERATION } = apiAction('GET_FOOTER_OPERATION', Module);

export const { addNewsCount, ADD_NEWS_COUNT } = apiAction('ADD_NEWS_COUNT', Module);

export const { getUploadToken, GET_UPLOAD_TOKEN } = apiAction('GET_UPLOAD_TOKEN', Module);

export const SET_SCREEN_SIZE = 'SET_SCREEN_SIZE';
export const setScreenSize = (data) => action(SET_SCREEN_SIZE, data);

export const PREFETCH_SET = 'PREFETCH_SET';
export const prefetchSet = () => action(PREFETCH_SET);

export const SEO_SET = 'SEO_SET';
export const seoSet = (seoData) => action(SEO_SET, seoData);

export const { getChannelOperationAd, GET_CHANNEL_OPERATION_AD } = apiAction('GET_CHANNEL_OPERATION_AD', Module);
export const { addInnerAdCount, ADD_INNER_AD_COUNT } = apiAction('ADD_INNER_AD_COUNT', Module);
export const { getPreAfterAd, GET_PRE_AFTER_AD } = apiAction('GET_PRE_AFTER_AD', Module);
export const { incrReadCount, INCR_READ_COUNT } = apiAction('INCR_READ_COUNT', Module);
