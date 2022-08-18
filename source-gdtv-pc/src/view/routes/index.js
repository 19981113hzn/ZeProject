/**
 * 模块注册
 */
import React from 'react';
import Loadable from 'react-loadable';
import { VIDEOJS } from './dependences';

/**
 * 加载组件
 * @param {*} component
 * @param {*} asyncComponent
 * @param {*} isSsr 是否开启服务端渲染
 * @returns
 */
const getComponent = (component, asyncComponent, isSsr = true) => {
    if (isSsr) {
        asyncComponent.prefetch = component.prefetch;
    }
    console.log('component.displayName', component.displayName, isSsr);
    return asyncComponent;
};

const routes = [
    {
        path: '/login',
        component: Loadable({
            loader: () => import('../containers/LoginPage'),
            loading: _ => null,
            modules: ['../containers/LoginPage']
        }),
    },
    {
        path: '/',
        component: getComponent(require('../containers/Root').default, Loadable({
            loader: () => import('../containers/Root'),
            loading: _ => null
        }), false),
        routes: [
            {
                path: '/',
                component: getComponent(require('../containers/HomePage').default, Loadable({
                    loader: () => import('../containers/HomePage'),
                    loading: _ => null
                })),
                exact: true,
                moduleName: 'HomePage'
            },
            {
                path: '/index',
                component: getComponent(require('../containers/HomePage').default, Loadable({
                    loader: () => import('../containers/HomePage'),
                    loading: _ => null
                })),
                exact: true,
                moduleName: 'HomePage'
            },
            {
                // 搜索
                path: '/search',
                component: getComponent(require('../containers/SearchPage').default, Loadable({
                    loader: () => import('../containers/SearchPage'),
                    loading: _ => null,
                    modules: ['../containers/SearchPage']
                })),
                exact: true,
                moduleName: 'SearchPage',
                noRedirect: true
            },
            {
                // 节目库
                path: '/tvPrograms',
                component: getComponent(require('../containers/TvPrograms').default, Loadable({
                    loader: () => import('../containers/TvPrograms'),
                    loading: _ => null,
                    modules: ['../containers/TvPrograms']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'TvPrograms',
                noRedirect: true
            },
            {
                // 图文
                path: '/article/:id',
                component: getComponent(require('../containers/NewsDetail/Articles').default, Loadable({
                    loader: () => import('../containers/NewsDetail/Articles'),
                    loading: _ => null,
                    modules: ['../containers/NewsDetail/Articles']
                })),
                dependence: VIDEOJS,
                exact: true,
                moduleName: 'NewsDetail'
            },
            {
                // 图集
                path: '/gallery/:id',
                component: getComponent(require('../containers/NewsDetail/Gallery').default, Loadable({
                    loader: () => import('../containers/NewsDetail/Gallery'),
                    loading: _ => null,
                    modules: ['../containers/NewsDetail/Gallery']
                })),
                exact: true,
                moduleName: 'NewsDetail'
            },
            {
                // 视频
                path: '/video/:id',
                component: getComponent(require('../containers/NewsDetail/Video').default, Loadable({
                    loader: () => import('../containers/NewsDetail/Video'),
                    loading: _ => null,
                    modules: ['../containers/NewsDetail/Video']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'NewsDetail'
            },
            {
                // 电视节目
                path: '/tv/:id',
                component: getComponent(require('../containers/NewsDetail/Tv').default, Loadable({
                    loader: () => import('../containers/NewsDetail/Tv'),
                    loading: _ => null,
                    modules: ['../containers/NewsDetail/Tv']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'NewsDetail'
            },
            {
                // 广播节目
                path: '/audio/:id',
                component: getComponent(require('../containers/NewsDetail/Audio').default, Loadable({
                    loader: () => import('../containers/NewsDetail/Audio'),
                    loading: _ => null,
                    modules: ['../containers/NewsDetail/Audio']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'NewsDetail'
            },
            {
                // 剧集
                path: '/seriesVideo/:id/:episodeId?',
                component: getComponent(require('../containers/TopicDetail/Series').default, Loadable({
                    loader: () => import('../containers/TopicDetail/Series'),
                    loading: _ => null,
                    modules: ['../containers/TopicDetail/Series']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'TopicDetail',
                noRedirect: true
            },
            {
                // 外链
                path: '/outlink/:id',
                component: getComponent(require('../containers/NewsDetail/OutLink').default, Loadable({
                    loader: () => import('../containers/NewsDetail/OutLink'),
                    loading: _ => null,
                    modules: ['../containers/NewsDetail/OutLink']
                })),
                exact: true,
                moduleName: 'NewsDetail',
                noRedirect: true
            },
            {
                // 专题
                path: '/topic/:id',
                component: getComponent(require('../containers/TopicDetail/Topic').default, Loadable({
                    loader: () => import('../containers/TopicDetail/Topic'),
                    loading: _ => null,
                    modules: ['../containers/TopicDetail/Topic']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'TopicDetail',
                noRedirect: true
            },
            {
                // 一级频道
                path: '/channels/:channelId',
                component: getComponent(require('../containers/ChannelsPage').default, Loadable({
                    loader: () => import('../containers/ChannelsPage'),
                    loading: _ => null,
                    modules: ['../containers/ChannelsPage']
                })),
                exact: true,
                moduleName: 'ChannelsPage'
            },
            {
                // 频道详情
                path: '/channelDetail/:channelPk',
                component: getComponent(require('../containers/ChannelDetail').default, Loadable({
                    loader: () => import('../containers/ChannelDetail'),
                    loading: _ => null,
                    modules: ['../containers/ChannelDetail']
                })),
                exact: true,
                moduleName: 'ChannelDetail'
            },
            {
                // 电视直播,此路由已绑定到外网
                path: '/tvChannelDetail/:id',
                component: getComponent(require('../containers/TvLive').default, Loadable({
                    loader: () => import('../containers/TvLive'),
                    loading: _ => null,
                    modules: ['../containers/TvLive']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'TvLive'
            },
            {
                // 广播直播,此路由已绑定到外网
                path: '/audioChannelDetail/:id',
                component: getComponent(require('../containers/AudioLive').default, Loadable({
                    loader: () => import('../containers/AudioLive'),
                    loading: _ => null,
                    modules: ['../containers/AudioLive']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'AudioLive'
            },
            {
                // 电视栏目详情
                path: '/tvColumn/:columnPk',
                component: getComponent(require('../containers/ChannelDetail').default, Loadable({
                    loader: () => import('../containers/ChannelDetail'),
                    loading: _ => null,
                    modules: ['../containers/ChannelDetail']
                })),
                exact: true,
                moduleName: 'ChannelDetail',
            },
            {
                // 广播节目详情
                path: '/audioColumn/:columnPk',
                component: getComponent(require('../containers/ChannelDetail').default, Loadable({
                    loader: () => import('../containers/ChannelDetail'),
                    loading: _ => null,
                    modules: ['../containers/ChannelDetail']
                })),
                exact: true,
                moduleName: 'ChannelDetail'
            },
            {
                // 电视栏目拆条回顾
                path: '/tvColumnVideo/:id',
                component: getComponent(require('../containers/TvColumnVideo').default, Loadable({
                    loader: () => import('../containers/TvColumnVideo'),
                    loading: _ => null,
                    modules: ['../containers/TvColumnVideo']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'TvColumnVideo'
            },
            // {
            //     // 广播节目拆条回顾
            //     path: '/audioColumnVideo/:id',
            //     component: getComponent(require('../containers/TvColumnVideo').default, Loadable({
            //         loader: () => import('../containers/TvColumnVideo'),
            //         loading: _ => null,
            //         modules: ['../containers/TvColumnVideo']
            //     })),
            //     exact: true,
            //     dependence: VIDEOJS,
            //     moduleName: 'TvColumnVideo'
            // },
            {
                // 直播
                path: '/live/:id',
                component: getComponent(require('../containers/LiveRoom').default, Loadable({
                    loader: () => import('../containers/LiveRoom'),
                    loading: _ => null,
                    modules: ['../containers/LiveRoom']
                })),
                exact: true,
                dependence: VIDEOJS,
                moduleName: 'LiveRoom',
                noRedirect: true
            },
            {
                path: '/404',
                component: getComponent(require('../containers/ErrorPage').default, Loadable({
                    loader: () => import('../containers/ErrorPage'),
                    loading: _ => null,
                    modules: ['../containers/ErrorPage']
                }), false),
                exact: true
            }
        ]
    }
];

export default routes;
