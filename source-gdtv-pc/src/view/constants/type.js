/** 信息流展现形式所对应的记录条数 */
export const DISPLAY_TYPE_COUNT = {
    // 横小图
    0: 7,
    // 1竖小图
    1: 7,
    // 2第一个横大图混合横小图
    2: 11
};

/** 信息流类型 */
export const FLOW_TYPE = {
    // 新闻
    NEWS: 0,
    // 专题
    TOPIC: 1,
    // 普通外链
    OUTLINK: 2,
    // 直播
    LIVE: 3
};

/* 广告类型 */
export const AD_TYPE = {
    // 无跳转
    NONE: -1,
    // 外链
    OUTLINK: 0,
    // 新闻
    NEWS: 1,
    // 频道
    CHANNEL: 2,
    // 专题
    TOPIC: 3,
    // 电视栏目
    TV: 4
};

/** 新闻内容类型 */
export const NEWS_CONTENT_TYPE = {
    ARTICAL: 0,
    VIDEO: 1,
    GALLERY: 2,
    TV: 3,
    SERIES: 4,
    OUTLINK: 5,
    AUDIO: 6
};

export const NEWS_CONTENT_TYPE_DESC = {
    undefined: '未知',
    [NEWS_CONTENT_TYPE.ARTICAL]: '图文',
    [NEWS_CONTENT_TYPE.VIDEO]: '视频',
    [NEWS_CONTENT_TYPE.GALLERY]: '图集',
    [NEWS_CONTENT_TYPE.TV]: '电视节目',
    [NEWS_CONTENT_TYPE.SERIES]: '剧集',
    // 内容外链
    [NEWS_CONTENT_TYPE.OUTLINK]: '外链',
};

/** 新闻内容类型对应的路由 */
export const NEWS_ROUTE = {
    0: 'article',
    1: 'video',
    2: 'gallery',
    3: 'tv',
    4: 'seriesVideo',
    5: 'outlink',
    6: 'audio'
};

/** 专题内容类型 */
export const TOPIC_CONTENT_TYPE = {
    undefined: '未知',
    0: '剧集',
    1: '专题',
};

/** 专题对应的路由 */
export const TOPIC_ROUTE = {
    0: 'seriesVideo',
    1: 'topic'
};

/** 直播内容类型 */
export const LIVE_CONTENT_TYPE = {
    undefined: '未知',
    0: '直播',
};

/** 直播对应的路由 */
export const LIVE_ROUTE = {
    0: 'live'
};
