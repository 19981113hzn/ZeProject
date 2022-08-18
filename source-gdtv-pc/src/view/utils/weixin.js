import { callApi } from 'Services/callApi';
import { BASENAME } from 'Services/baseName';

export const isWeixin = () => {
    const ua = navigator && navigator.userAgent || '';
    return ua.match(/micromessenger/gi);
};

/**
 * @desc 微信分享接口
 * @param {*args} obj
 */
export const wxSharePost = async ({
    title = '荔枝网',
    desc = '荔枝网',
    imgUrl = 'http://www2.gdtv.cn/slogo.png',
    shareSuccess = () => { },
    shareCancel = () => { },
    shareTrigger = () => { },
    shareComplete = () => { },
    link = window.location.href.replace(/[?||&]code=[\s\S]+&state=STATE/, ''),
}) => {
    if (!isWeixin()) {
        return;
    }
    const WX_ID = 'wx67ba90287876e5b7';
    const endpoint = '/api/wechat/v1/wechatSignature';
    const data = {
        type: 0,
        url: 'https://m.gdtv.cn',
    };

    const shareData = {
        title,
        desc,
        link,
        imgUrl: imgUrl || 'http://www2.gdtv.cn/slogo.png',
        success: shareSuccess,
        cancel: shareCancel,
        trigger: shareTrigger,
        complete: shareComplete,
    };

    const jsApiList = [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
    ];
    if (!window.wxConfig) {
        const getConfigPromise = new Promise((resolve, reject) => {
            callApi(BASENAME['www.gdtv.cn'] + endpoint, 'POST', { ...data }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
        const config = await getConfigPromise;
        window.wxConfig = config;
    }
    const wxConfig = window.wxConfig || {};
    const wx = window.wx || {};
    wx.config({
        debug: false,
        appId: WX_ID,
        timestamp: wxConfig.timestamp,
        nonceStr: wxConfig.nonceStr,
        signature: wxConfig.signature,
        jsApiList,
    });
    wx.ready(() => {
        // 2. 分享接口
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage(shareData);
        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline(shareData);
        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareQQ(shareData);
        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareWeibo(shareData);
        // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
        wx.onMenuShareQZone(shareData);
    });
};
