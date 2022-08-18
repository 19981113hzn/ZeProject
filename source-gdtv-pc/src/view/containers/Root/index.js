import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Switch, Redirect } from 'react-router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import prefetchSaga from 'Global/prefetch';
import Layout from 'Containers/Layout';
import ErrorBoundary from 'Components/ErrorBoundary';

import 'Public/css/theme/antd_modify.less';
import 'Public/css/global.less';
// import 'cropperjs/src/css/cropper.scss'; // cropperjs

import { OS } from 'Utils/utils';
import matchRoutes from 'View/routes/matchRoutes';

const host = {
    development: 'http://test-m-gdtv.itouchtv.cn',
    // development: 'https://m.gdtv.cn',
    production: 'https://m.gdtv.cn'
};

/**
 * 页面入口文件
 * PageName: 外层路由渲染
 *
 * Author: zhuhuishao
 * use: [ 外层路由展示 ]
 *
 */
class Root extends Component {
    static prefetch = prefetchSaga;

    componentWillMount() {
        // 重定向到m站
        if (typeof window === 'object' && !OS().isPc) {
            const isProdServeName = () => !window.location.hostname.includes('test');
            const hostName = isProdServeName() ? host.production : host.development;
            const { location } = this.props;
            if (this.isRedirect()) {
                window.location.href = `${hostName}${location.pathname}`;
            }
        }
    }

    isRedirect = () => {
        if (typeof window === 'object' && !OS().isPc) {
            const { location, route } = this.props;
            const [, path1] = location.pathname.split('/');
            const [curRoute = {}] = route.routes.filter(item => item.path.split('/')[1] == path1);
            return !curRoute.noRedirect;
        }
        return false;
    }

    render() {
        const { route, location, history } = this.props;

        let layout = {
            hasNav: true,
            hasHeader: true
        };
        const matchRoutesList = matchRoutes(this.props.route.routes, location.pathname);
        if (matchRoutesList.length) {
            layout = Object.assign(layout, matchRoutesList[matchRoutesList.length - 1].route.layout || {});
        }
        // 如果要重定向到移动端则返回空白页
        if (this.isRedirect()) {
            return (<div></div>);
        }
        return (
            <ConfigProvider locale={zhCN}>
                <ErrorBoundary {...this.props}>
                    <Layout {...this.props} layout={layout}>
                        <Switch>
                            {route.routes && route.routes.map(item => (
                                <Route key={item.path} path={item.path} exact={item.exact} component={item.component}></Route>
                            ))}
                            <Redirect to='/404' />
                        </Switch>
                    </Layout>
                </ErrorBoundary>
            </ConfigProvider>
        );
    }
}

export default Root;
