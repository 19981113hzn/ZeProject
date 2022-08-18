import { fork, call } from 'redux-saga/effects';
import { matchPath } from 'react-router-dom';
import globalSagas from 'Global/prefetch';

// 获取组件prefetch的saga任务
export default function prefetchData(url, routes) {
    let routeList = [];
    routes.filter(item => item.routes).forEach(item => {
        routeList = routeList.concat(item.routes);
    });

    const currRoute = routeList.map((route) => {
        const matchRoute = matchPath(url.split('?')[0], route);
        return { route, match: matchRoute };
    });
    // console.log('===currRoute', currRoute);
    const _currRoute = currRoute.filter(({ route, match }) => {
        // console.log('===route', route);
        return match && route.component.prefetch;
    });

    if (_currRoute.length && _currRoute[0].route.component.prefetch) {
        const params = {
            pathName: url,
            isPrefetch: true
        };
        return function* fetchData() {
            yield call(globalSagas, params);
            yield call(_currRoute[0].route.component.prefetch, params);
        };
    }
    return undefined;
}
