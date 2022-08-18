import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { SCREEN_SIZE } from 'Utils/tools';
import { CHANNEL_LIST } from 'Constants/hardCode';

import * as actionTypes from './actions';

const initialGlobalState = fromJS({
    isRequesting: false,
    // 屏幕尺寸
    screenSize: SCREEN_SIZE[0],
    // 顶部benner
    bannerList: [],
    // 友情链接
    friendlyLinks: {},
    // 所有频道
    channelList: [],
    // 分类导航栏
    navList: [],
    // 底部栏
    footerNavList: [],
    channelOperationAd: {},
    preAfterAd: {} // 贴片广告
});
const root = (state = initialGlobalState, action) => {
    switch (action.type) {
        case actionTypes.SET_SCREEN_SIZE:
            return state.set('screenSize', action.size);

        case actionTypes.GET_BANNER_FOCUS.SUCCESS: {
            const { channelFocusList } = action.response;
            channelFocusList.forEach((item) => {
                try {
                    const coverUrl = JSON.parse(item.coverUrl);
                    item.coverUrl = coverUrl.web;
                } catch (error) {
                    //
                }
            });
            return state.set('bannerList', fromJS(channelFocusList));
        }

        case actionTypes.GET_FRIENDLY_LINKS.SUCCESS:
            return state.set('friendlyLinks', fromJS(action.response));

        case actionTypes.GET_COMMON_CHANNEL.SUCCESS:
            return state.set('channelList', fromJS(action.response));

        case actionTypes.GET_HEADER_OPERATION.SUCCESS:
            return state.set('navList', fromJS(action.response.channelOperationInfoList));

        case actionTypes.GET_FOOTER_OPERATION.SUCCESS:
            return state.set('footerNavList', fromJS(action.response.channelOperationInfoList));

        case actionTypes.GET_CHANNEL_OPERATION_AD.REQUEST:
            return state.set('isRequesting', true);
        case actionTypes.GET_CHANNEL_OPERATION_AD.SUCCESS: {
            return state
                .set('channelOperationAd', action.response)
                .set('isRequesting', false);
        }
        case actionTypes.GET_CHANNEL_OPERATION_AD.FAILURE:
            return state.set('isRequesting', false);

        case actionTypes.GET_PRE_AFTER_AD.REQUEST:
            return state.set('isRequesting', true);
        case actionTypes.GET_PRE_AFTER_AD.SUCCESS: {
            return state
                .set('preAfterAd', action.response)
                .set('isRequesting', false);
        }
        case actionTypes.GET_PRE_AFTER_AD.FAILURE:
            return state.set('isRequesting', false);
        default:
            return state;
    }
};

const initialPrefetchState = fromJS({
    isPrefetch: false,
    use: false,
    title: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: ''
});
const prefetch = (state = initialPrefetchState, action) => {
    switch (action.type) {
        case actionTypes.PREFETCH_SET:
            return state.set('isPrefetch', true);

        case actionTypes.SEO_SET:
            return state
                .set('use', true)
                .set('title', action.title)
                .set('metaTitle', action.metaTitle)
                .set('metaKeywords', action.metaKeywords)
                .set('metaDescription', action.metaDescription);

        default:
            return state;
    }
};

const initialUploadTokenState = fromJS({
    isRequesting: false,
    token: {}
});
const uploadToken = (state = initialUploadTokenState, action) => {
    switch (action.type) {
        case actionTypes.GET_UPLOAD_TOKEN.REQUEST:
            return state.set('isRequesting', true);
        case actionTypes.GET_UPLOAD_TOKEN.SUCCESS:
            return state
                .set('token', action.response)
                .set('isRequesting', true);
        case actionTypes.GET_UPLOAD_TOKEN.FAILURE:
            return state.set('isRequesting', true);
        default:
            return state;
    }
};

export default combineReducers({
    root,
    uploadToken,
    prefetch
});
