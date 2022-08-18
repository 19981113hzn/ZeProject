import {
    FLOW_TYPE, NEWS_ROUTE, TOPIC_ROUTE, LIVE_ROUTE
} from 'Constants/type';

import moment from 'moment';

const R = require('ramda');

export const OS = () => {
    const ua = navigator.userAgent;
    const isWindowsPhone = /(?:Windows Phone)/.test(ua);
    const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
    const isAndroid = /(?:Android)/.test(ua);
    const isFireFox = /(?:Firefox)/.test(ua);
    const isChrome = /(?:Chrome|CriOS)/.test(ua);
    const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
    const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
    const isPc = !isPhone && !isAndroid && !isSymbian && !isTablet;
    return {
        isTablet,
        isPhone,
        isAndroid,
        isPc
    };
};

/**
 * 异步加载js
 * @param {string} url script标签的属性
 */
export const loadScript = (url) => new Promise(resolve => {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.onload = function () {
        script = null;
        resolve();
    };
    script.setAttribute('src', url);
    document.body.appendChild(script);
});

/**
 * 安全的转化为json
 * @param str
 * @returns {{}|any}
 */
export const toJson = (str) => {
    try {
        return JSON.parse(str || '{}');
    } catch (e) {
        return {};
    }
};

export const concatPictureArrayByPosition = (arr, arr1) => {
    console.log(arr, arr1);
};

/**
 * 计算视频长度
 *
 * @param [number] timeLength [时间长度]
*/
export function calVideoTime(timeLength) {
    let timeL = '';
    const h = parseInt(timeLength / 3600, 10);
    const m = parseInt((timeLength % 3600) / 60, 10);
    const s = parseInt((timeLength % 3600) % 60, 10);
    if (h > 0) {
        timeL = h >= 10 ? (h + ':') : ('0' + h + ':');
    }

    timeL += m >= 10 ? (m + ':') : ('0' + m + ':');
    timeL += s >= 10 ? s : '0' + s;

    return timeL;
}


/**
 * 格式化阅读数
 *
 * @param [number] nums [阅读数]
 */
export function formatNum(nums) {
    const _nums = nums.toString();
    const _splitNum = 3;

    if (_nums.length <= _splitNum) return nums;

    let _result = '';

    const _first = _nums.slice(0, _nums.length % _splitNum);
    const _after = _nums.slice(_nums.length % _splitNum);

    for (let i = 0, j = 1; i < _after.length; i += 1) {
        _result += _after[i];
        if (j % _splitNum == 0) _result += ',';
        j += 1;
    }

    _result = _result.slice(0, -1);
    return _first + ',' + _result;
}


/**
 * 获得视频Url
 *
 * @param [string] videoUrl [url json 字符串]
 * @param [string] quality [输出视频质量： hd | sd]
*/
export function getVideoUrl(videoUrl, quality) {
    const video = videoUrl && videoUrl != '' ? JSON.parse(videoUrl) : {};

    let videoSourceUrl = '';

    if (video.source && video.source.hd && video.source.sd) {
        videoSourceUrl = quality == 'sd' ? video.source.sd : video.source.hd;
    }

    return videoSourceUrl;
}


/**
 * 获得字符串长度
 *
 * @param  [syring] str [目标字符串]
 */
export function getStrLength(str) {
    var len = 0;
    for (let i = 0; i < str.length; i += 1) {
        const c = str.substr(i, 1);
        const ts = escape(c);
        if (ts.substring(0, 2) == '%u') {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
}


/**
 * 裁剪字符串
 *
 * @param [string] str [需要裁剪的字符串]
 * @param [object] cfg [配置参数 example: {len: 裁剪长度,默认10; stuff: 裁剪后的后缀，默认没有}]
 */
export function cutStr(str, cfg) {
    if (!str) return false;
    const _len = str.length;
    const len = (cfg && cfg.len) || 10;
    const stuff = (cfg && cfg.stuff) || '';
    return str.slice(0, len < _len ? len : _len) + (len < _len ? stuff : '');
}


/**
 * 高亮关键字
 *
 * @param [string] str [目标字符串]
 * @param [string] key [需要高亮的关键字]
 */
export function hightLight(str, key) {
    if (!str || !str.length || !key) return false;
    const reg = new RegExp(`([${key}]{2,})`, 'g');
    const res = str.replace(reg, "<font color='red'>$1</font>");
    return res;
}


// 判断是否为移动端
export function isMobile() {
    if (typeof window == 'object') {
        const ua = navigator.userAgent;
        if ((ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return -1;
        }
    }
    return 0;
}


/**
 * 格式化时间
 *
 * @param [number] time [时间戳]
 * @param [string] type [格式化类型]
 *
 */
export const timeFormat = (time, type) => {
    if (!time) { return ''; }

    const nowDate = new Date();
    const dateInfo = new Date(time);

    const fmtObj = {
        year: dateInfo.getFullYear(),
        month: dateInfo.getMonth() + 1,
        date: dateInfo.getDate(),
        hour: dateInfo.getHours(),
        minute: dateInfo.getMinutes(),
        second: dateInfo.getSeconds()
    };

    const keys = Object.keys(fmtObj);

    keys.forEach(key => {
        fmtObj[key] = fmtObj[key] < 10 ? '0' + fmtObj[key] : fmtObj[key];
    });

    const {
        year, month, date, hour, minute, second
    } = fmtObj;
    let dateData = [year, month, date].join('-');
    const timeData = [hour, minute, second].join(':');

    let timeAfter = parseInt(Math.abs(nowDate - dateInfo) / 1000 / 60, 10);
    if (timeAfter < 60) {
        timeAfter = (timeAfter <= 0 ? 1 : timeAfter) + '分钟';
    } else if (timeAfter >= 60 && timeAfter < 24 * 60) {
        timeAfter = parseInt(timeAfter / 60, 10) + '小时';
    } else {
        timeAfter = parseInt(timeAfter / 60 / 24, 10) + '天';
    }


    switch (type) {
        case 'date-after': return timeAfter;
        case 'yyyy-MM-dd':
            dateData = [year, month, date].join('-');
            return dateData;
        case 'yyyy/MM/dd':
            dateData = [year, month, date].join('/');
            return dateData;
        case 'yyyyMMdd':
            dateData = [year, month, date].join('');
            return dateData;
        case 'yyyy-MM-dd hh:mm:ss':
            dateData = [year, month, date].join('-');
            return dateData + ' ' + timeData;
        case 'yyyy/MM/dd hh:mm:ss':
            dateData = [year, month, date].join('/');
            return dateData + ' ' + timeData;
        default: return dateData + ' ' + timeData;
    }
};


/**
 *  全局获取URL参数方法
 *
 *  @param [string] testParam [测试参数字符串]
 *  @param [bool] preview [是否预览]
*/
export const urlParams = (path) => {
    const paramObj = {};
    const url = path || typeof window === 'object' && window.location.href || '';
    if (url.split('?')[1]) {
        const paramList = url.split('?')[1].split('&');
        paramList.forEach(item => {
            const [name, value] = item.split('=');
            paramObj[name] = value;
        });
    }

    return paramObj;
};

/**
 * 安全地深路径取值, 避免多层 undifined 判断
 * @param {object|array} value - 要 len 取值的对象或数组
 * @param {array} lens - 取值路径数组
 */
export const safeLens = (value, lens) => R.view(R.lensPath(lens), value);


/**
 * @param {string} str - 视频地址字符串
 */
export const urlJSON = (str) => {
    if (typeof str == 'string') {
        try {
            const obj = JSON.parse(str);
            const [key] = Object.keys(obj).filter(k => obj[k]);
            return obj[key];
        } catch (e) {
            console.log(str, 'is a string');
            return str;
        }
    }
    return '';
};

export const IMG_OSS_RESIZE = {
    undefined: [],
    swiper: [436, 80],
    small: [237, 134],
    big: [487, 275],
    vertical: [237, 355]
};

/**
 * 压缩图片
 * @param {*} coverUrl
 */
export const getCompressCoverUrl = (coverUrl, width = '237', height = '134') => {
    if (!coverUrl) {
        return '';
    }
    try {
        const temp = JSON.parse(coverUrl);
        const [key] = Object.keys(temp).filter(k => temp[k][0]);
        [coverUrl] = temp[key];
    } catch (error) {
        // console.log('only url string');
    }
    if (coverUrl.indexOf('img.grtn.cn') != -1) {
        const [a, b] = coverUrl.split('/img/');
        return `${a}/img/${width}x/${b}`;
    }
    return `${coverUrl}?x-oss-process=image/resize,m_fill,w_${width},h_${height}`;
};

/** 接口实体类型 */
export const ENTITY_TYPE = {
    DATA_JSON: 0,
    DATA_JSON_STR: 1
};

/** 统一字段名 */
export const ENTITY_KEY = 'dataJSON';
/**
 * 获取实体
 * 以data类型区分
 * 多处使用
 */
export const getEntity = (sourceData, extra = {}) => {
    const { entityType = ENTITY_TYPE.DATA_JSON_STR } = extra;
    let news = {};
    if (Object.keys(sourceData).length == 0) {
        return sourceData;
    }
    if (sourceData[ENTITY_KEY]) {
        return sourceData[ENTITY_KEY];
    }
    try {
        switch (entityType) {
            case ENTITY_TYPE.DATA_JSON:
                news = { ...sourceData };
                news.title = sourceData.title || sourceData.name;
                break;
            case ENTITY_TYPE.DATA_JSON_STR:
                news = JSON.parse(sourceData.data);
                news.objectType = sourceData.type;
                news.title = news.title || news.name;
                break;
            default:
                news = sourceData;
                break;
        }
    } catch (error) {
        news = sourceData;
    }
    return news;
};

export const formatEntity = (sourceData) => {
    try {
        const news = JSON.parse(sourceData.data);
        news.objectType = sourceData.type;
        news.title = news.title || news.name;
        switch (`${sourceData.type}`) {
            case `${FLOW_TYPE.TOPIC}`:
                news.contentType = news.contentType === undefined ? news.type : news.contentType;
                break;
            default:
                break;
        }
        sourceData[ENTITY_KEY] = news;
    } catch (error) {
        //
    }
    return sourceData;
};


/**
 * 解析成详情页面路径
 * @param {*} params
 */
export const getDetailRoute = (params) => {
    const {
        // 源数据
        source = {},
        objectType = 0,
        contentType = 0,
        // 加密id
        sid,

        // 以下参数由extra解构传入
        // 剧集第几集,起始位1
        episodeId = 1,
        // 频道id
        channelId
    } = params;
    switch (`${objectType}`) {
        case `${FLOW_TYPE.NEWS}`: {
            switch (`${contentType}`) {
                case '0': // 图文
                case '1': // 视频
                case '2': // 图集
                case '3': // 电视节目
                case '6': // 广播节目
                case '5': // 外链
                    return `/${NEWS_ROUTE[contentType]}/${sid}`;
                case '4': {
                    // 剧集某集,跳转剧集播放页
                    const searchParams = { videoId: sid };
                    const search = Object.keys(searchParams).map(key => (
                        searchParams[key] ? `${key}=${searchParams[key]}` : ''
                    )).join('&');
                    // 剧集id
                    const serialsId = source?.serialsInfo?.sid;
                    return `/${NEWS_ROUTE[contentType]}/${serialsId}?${search}`;
                }
                default:
                    break;
            }
            break;
        }

        case `${FLOW_TYPE.TOPIC}`: {
            switch (`${contentType}`) {
                case '0': {
                    // 剧集
                    const searchParams = { channelId };
                    const search = Object.keys(searchParams).map(key => (
                        searchParams[key] ? `${key}=${searchParams[key]}` : ''
                    )).join('&');
                    return `/${TOPIC_ROUTE[contentType]}/${sid}/${episodeId}?${search}`;
                }
                case '1': // 专题
                    return `/${TOPIC_ROUTE[contentType]}/${sid}`;
                default:
                    break;
            }
            break;
        }

        case `${FLOW_TYPE.OUTLINK}`: {
            const { externalUrl } = source;
            return externalUrl;
        }

        case `${FLOW_TYPE.LIVE}`: {
            return `/${LIVE_ROUTE[0]}/${sid}`;
        }

        default:
            break;
    }
    return '';
};

/* eslint-disable */
const getDateDiff = (dateTimeStamp = new Date().getTime()) => {
    let result = '';
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const now = new Date().getTime();
    const diffValue = now - dateTimeStamp;
    if (diffValue < 0) return;
    const monthC = diffValue / month;
    const weekC = diffValue / (7 * day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    if (monthC >= 1) {
        result = '' + parseInt(monthC, 0) + '月前';
    } else if (weekC >= 1) {
        result = '' + parseInt(weekC, 0) + '周前';
    } else if (dayC >= 1) {
        result = '' + parseInt(dayC, 0) + '天前';
    } else if (hourC >= 1) {
        result = '' + parseInt(hourC, 0) + '小时前';
    } else if (minC >= 1) {
        result = '' + parseInt(minC, 0) + '分钟前';
    } else {
        result = '刚刚';
    }
    return result;
};
/* eslint-disable */

export const handleTime = (lastTime) => {
    const nowTime = new Date().getTime();
    const diff = nowTime - lastTime;
    return diff <= (24 * 60 * 60 * 1000) ? getDateDiff(lastTime) : timeFormat(lastTime);
};

export function timeFromNow(time) {
    const formatTime = 'HH:mm:ss';
    const fromNowStr = moment(time).fromNow();

    if (fromNowStr.includes('内')) {
        return moment(time).format(formatTime);
    }
    return fromNowStr;
}
