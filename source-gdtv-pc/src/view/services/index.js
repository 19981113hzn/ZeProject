import { callApi } from './callApi';
import apiBaseName from './baseName';

// 获取节点参数,用于防盗链
export const getTcdnNode = () => callApi(apiBaseName.tcdn + '/getParam', 'GET');

// token获取
export const getUploadToken = (data) => callApi(apiBaseName.api + '/upload/v1/uploadToken', 'GET', data);

// 密码登录
export const loginByPassword = (data) => callApi(apiBaseName.api + '/v3/loginByPassword', 'POST', data);

// 获取图片验证码
export const getImgVerificationCode = (data) => callApi(apiBaseName.api + `/v1/imgVerificationCode/${data.cType}`, 'GET', { uuid: data.uuid }, {
    returnRes: true,
    responseType: 'blob'
});

// 验证码登录
export const loginByCode = (data) => callApi(apiBaseName.api + '/v1/loginByVerificationCode', 'POST', data);

// 用户注册
export const register = (data) => callApi(apiBaseName.api + '/v2/register', 'POST', data);

// 接受验证码
export const getVerificationCode = (data) => callApi(apiBaseName.api + '/v1/verificationCode', 'POST', data);

// 第三方登录
export const loginByThirdParty = (data) => callApi(apiBaseName.api + '/v1/thirdPartyAccount/login', 'POST', data);

// 获取用户信息
export const getUserInfo = (data) => callApi(apiBaseName.api + '/v1/user', 'GET', data);

// 修改用户信息
export const updateUserInfo = (data) => callApi(apiBaseName.api + '/v1/user', 'PUT', data);

// 基于关键字搜索
export const searchNews = (data) => callApi(apiBaseName.api + '/search/v1/news', 'POST', data);

// 获得频道列表
export const getCommonChannel = () => callApi(apiBaseName.api + '/channel/v2/commonChannel', 'GET');

// 获得首页SEO
export const getSeoConfig = () => callApi(apiBaseName.api + '/v1/seoConfig', 'GET');

// 获得首页显示的频道列表
export const getHomeShowChannels = () => callApi(apiBaseName.api + '/channel/v2/commonChannel/home', 'GET');

// 获得频道新闻列表
export const getChannelNews = (data) => callApi(apiBaseName.api + '/channel/v1/news', 'GET', data);

// 获得友情链接列表
export const getFriendlyLinks = () => callApi(apiBaseName.api + '/friendlylink/v1/qrCodeAndTextLinks', 'GET');

// 获取分类导航栏或底部栏信息
export const getChannelOperation = (data) => callApi(apiBaseName.api + '/channel/v1/operation', 'GET', data);

// 获得频道焦点图
export const getChannelFocus = (data) => callApi(apiBaseName.api + '/channelFocus/v1/channelFocus', 'GET', data);

// 获得热点新闻列表
export const getHotNews = () => callApi(apiBaseName.api + '/hotnews/v4/hotnews', 'GET');

// 获取运营位广告
export const getChannelOperationAd = () => callApi(apiBaseName.api + '/innerAd/v1/channelOperationAd', 'GET');

// 广告埋点统计
export const addInnerAdCount = (data) => callApi(apiBaseName.api + `/innerAd/v1/innerAdCount?pks=${data.pks.toString()}&type=${data.type}`, 'PUT', data);

// 获取贴片广告
export const getPreAfterAd = data => callApi(apiBaseName.api + `/innerAd/v1/preAfterAd?columnPk=${data.columnPk}`, 'GET');

// 获得滚动新闻
export const getRollNews = () => callApi(apiBaseName.api + '/news/v1/rollNews', 'GET');

// 获得新闻详情内容
export const getNewsContent = (data) => callApi(apiBaseName.api + `/news/v1/news/${data.sid}`, 'GET');

// 获得新闻最新内容列表
export const getRecentlyNewsList = (data) => callApi(apiBaseName.api + '/news/v1/recentlyNews', 'GET', data);

// 获得新闻相关推荐
export const getRelateNewsList = (data) => callApi(apiBaseName.api + '/news/v1/relateNews', 'GET', data);

// 增加新闻统计量
export const addNewsCount = (data) => callApi(apiBaseName.api + `/news/v1/newsCount/${data.id}/${data.countType}`, 'PUT');

// 增加节目统计量
export const incrReadCount = data => callApi(apiBaseName.api + `/tv/v1/tvMenu/${data.tvMenuId}/incrReadCount`, 'PUT', data);

// 获取用户新闻浏览历史
export const getBrowseHistory = (data) => callApi(apiBaseName.api + '/news/v1/userBrowseHistory', 'GET', data);

// 获取电视详情数据
export const getTvChannelDetail = (data) => callApi(apiBaseName.api + `/tv/v2/tvChannel/${data.tvChannelPk}`, 'GET', data);

// 获取电视频道列表
export const getTvChannelList = (data) => callApi(apiBaseName.api + '/tv/v2/tvChannel', 'GET', data);

// 获取广播频道列表
export const getBroadcastChannelList = (data) => callApi(apiBaseName.api + '/tv/v2/tvChannel', 'GET', data);

// 获取广播频道列表
export const getRadioChannelList = (data) => callApi(apiBaseName.api + '/tv/v2/tvChannel', 'GET', data);

// 获取电视节目菜单
export const getTvMenuList = (data) => callApi(apiBaseName.api + '/tv/v2/tvMenu', 'GET', data);

// 获取电视栏目列表
export const getTvColumn = (data) => callApi(apiBaseName.api + `/tvColumn/v1/tvColumn/${data.tvChannelPk}`, 'GET');

// 获取电视栏目列表
export const getBroadcastColumn = (data) => callApi(apiBaseName.api + `/tvColumn/v1/tvColumn/${data.tvChannelPk}`, 'GET');

// 获取专题详情
export const getNewsTopic = (data) => callApi(apiBaseName.api + '/v1/newsTopic', 'GET', data);

// 获取专题栏目及成员列表
export const getNewsTopicColumn = (data) => callApi(apiBaseName.api + '/v2/newsTopic/column', 'GET', data);

// 获取剧集成员列表
export const getNewsTopicMemberList = (data) => callApi(apiBaseName.api + '/v1/newsTopic/memberList', 'GET', data);

// 获取剧集成员列表V2
export const getNewsTopicMemberListV2 = (data) => callApi(apiBaseName.api + '/v2/newsTopic/memberList', 'GET', data);

// 电视栏目回顾列表
export const getColumnVideoList = (data) => callApi(apiBaseName.api + '/tvColumn/v1/news', 'GET', data);

// 电视栏目详情
export const getColumnInfo = (data) => callApi(apiBaseName.api + `/tvColumn/v1/column/${data.columnPk}`, 'GET');

// 频道详情
export const getChannelInfo = (data) => callApi(apiBaseName.api + `/channel/v1/channel/${data.channelPk}`, 'GET');

// 获取直播间信息
export const getLive = (data) => callApi(apiBaseName.api + '/live/v1/get', 'GET', data);

// 获取最新更新直播
export const getRecentlyLive = (data) => callApi(apiBaseName.api + '/live/v1/recentlyLive', 'GET', data);

// 获取直播厅内容
export const getLiveContent = data => callApi(apiBaseName.api + '/liveContent/v1/get', 'GET', data);

// 增加直播统计量
export const liveCount = (data) => callApi(apiBaseName.api + `/live/v1/liveCount/${data.id}/${data.countType}`, 'PUT');

// 获取图文直播内容
export const getMediaLive = (data) => callApi(apiBaseName.api + '/medialivecontent/v1/mediaLiveContent', 'GET', data);
