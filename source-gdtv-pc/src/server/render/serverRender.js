import React from 'react';
import { Provider } from 'react-redux';

import { renderToNodeStream, ReactDOMServer, renderToString } from 'react-dom/server';
import { StaticRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import serialize from 'serialize-javascript';

import renderRoutes from 'View/routes/renderRoutes';
import matchRoutes from 'View/routes/matchRoutes';
import getActiveRoute from 'View/routes/getActiveRoute';
import routes from 'View/routes';
import path from 'path';
import { renderHeader, renderFooter } from './serverRenderTpl';
import configureStore from './store';
import prefetchData from './prefetchData';
import { getHelmetData } from '../utils/helmet';
import env from '../utils/env';

const isProd = env();

module.exports = async (req, res) => {
    try {
        const store = configureStore();
        const context = {};

        if (context.url) {
            res.redirect(context.url);
            return;
        }
        // handle ssr code splitting


        // 拿当前路由下需要prefetch 的saga任务
        const prefetchSaga = prefetchData(req.url, routes);
        // 等待执行saga操作
        if (prefetchSaga) {
            await store.runSaga(prefetchSaga).done;
            console.log('sagas load compelete ...');
        }
        // 开始服务端渲染
        const helmet = Helmet.renderStatic();
        const preloadedState = store.getState();

        const helmetData = getHelmetData(helmet, preloadedState);

        const buildPath = isProd ? require('../../../dist/cdn/asset-manifest.json') : {};

        const activeRoute = getActiveRoute(routes, req.path);
        const ActiveComponent = activeRoute.component;
        const _activeRoute = matchRoutes(routes, req.path);
        const { dependence } = _activeRoute && _activeRoute.length > 0 && _activeRoute[_activeRoute.length - 1].route || {};
        const header = renderHeader(helmetData, isProd, buildPath, {}, dependence);
        const modules = [];
        const appWithRouter = (
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <Route render={props => <ActiveComponent {...props} route={activeRoute} />} />
                </StaticRouter>
            </Provider>
        );
        const htmlStr = renderToString(appWithRouter);

        // console.log('===modules', req.url, modules);
        const stats = path.resolve(__dirname, '../../../dist/react-loadable.json');
        const bundles = getBundles(stats, modules);
        // console.log('===bundles', bundles);
        const linkTag = bundles
            .filter(i => i.publicPath.toString().endsWith('.css'))
            .map(i => `<link href="${i.publicPath}" rel="stylesheet"></link>`);
        const scriptTag = bundles
            .filter(i => i.publicPath.toString().endsWith('.js'))
            .map(i => `<script src="${i.publicPath}"></script>  `);
        const footer = renderFooter({ linkTag, scriptTag }, serialize(preloadedState), isProd, buildPath, htmlStr);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'text/html'); // 设置正确content-type才会触发gzip
        res.write(header + footer);
        res.send();

        store.close();
    } catch (e) {
        console.log(e);
        res.status(503).end();
    }
};
