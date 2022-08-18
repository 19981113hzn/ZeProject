# react-ssr-boilerplate

## Main Libaries
* [react v16](http://facebook.github.io/react/index.html)
* [redux](https://redux.js.org/)
* [react-router v4](https://reacttraining.com/react-router/web/guides/philosophy)
* [react-router-redux](https://www.npmjs.com/package/react-router-redux)
* [react-redux](https://github.com/reactjs/react-redux)
* [redux-saga](https://redux-saga.js.org/)
* [immutable](http://facebook.github.io/immutable-js/)
* [express](https://github.com/expressjs/express)

## features

0. 开发注意事项
    * [页面](#notic_page)

1. SSR
    * [prefetch](#prefetch)
    * [render](#render)
    * [seo](#seo)
    * [日志处理log4js](https://github.com/log4js-node/log4js-node) 

2. 路由
    * [统一路由配置](#config)
    * [代码分割及按需加载](#code-spilt) (本项目案例)
    * [history](#history)
    * [路由阻挡](#history-block)

3. 模块机制
    * [模块注册](#module) (本项目案例)

4. [Higher Order Component](#hoc)

5. 方便的配置
    * [alias](#alias)

6. 测试
    * [start-ssr](#start-ssr)
    * [jest](#jest)
    * [enzyme](#enzyme)

7. 配合chrome插件使用
    * [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?utm_source=chrome-app-launcher-info-dialog)
    * [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?utm_source=chrome-app-launcher-info-dialog)

8. Reference
    * [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate)
    * [universal-react](https://github.com/alexisjanvier/universal-react)
    * [react-router-config](https://www.npmjs.com/package/react-router-config)



## 0. 开发注意事项
### <span id="notic_page">注意</span>
1. 页面入口文件`src/view/containers/Root`
2. 初始化需要请求接口，需引入`global/isPrefetch`作为判断，因服务端渲染时已经预先请求了
3. 在`src/view/routes/index.js`引入页面，之后会自动加载该页面路由及数据
4. ssr渲染时没有window，开发时一定要注意兼顾
5. 有包更新时，需要压缩`node_modules`给海哥更新到服务器
6. 新增页面或者较大功能调整发布前一定要自测，用生产的打包命令
   * 验证spa：本地安装个服务器访问`/dist/html/index.html`，这个是给用户访问的，要确定整套功能没问题
   * 验证ssr：本地在`dist`目录下运行`node server/server-gdtv.js`，这个是给百度爬虫用的，运行和接口不报错就行
   * 验证ssr: 需要在本地开启vpn通道


## 1. SSR
### <span id="prefetch">prefetch</span>
> 服务端数据预处理

```
// 统一处理Global / Page prefetch任务
// 注册saga task

export default function prefetchData(url, routes) {
    let routeList = [];
    routes.filter(item => item.routes).forEach(item => {
        routeList = routeList.concat(item.routes);
    });

    const currRoute = routeList.map((route) => ({ route, match: matchPath(url, route) }))
        .filter(({ route, match }) => match && route.component.prefetch);   

    if (currRoute.length && currRoute[0].route.component.prefetch) {
        const params = { 
            pathName: url, 
            isPrefetch: true 
        };

        return function* fetchData() {
            yield fork(globalSagas, params);
            yield fork(currRoute[0].route.component.prefetch, params);
        };
    }
    return undefined;
}
```

### <span id="render">render</span>
> 服务端渲染模式

```
const appWithRouter = (
    <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
            {renderRoutes()}
        </StaticRouter>
    </Provider>
);    
```
> render渲染到节点流的方式

```
res.write(renderHeader(helmetData, isProd, buildPath));
const stream = renderToNodeStream(appWithRouter);
stream.pipe(res, { end: false });
stream.on('end', () => {
    res.write(renderFooter(loadableState, preloadedState, isProd, buildPath));
    res.send();
});
```

### <span id="seo">seo</span>
> 服务端SEO Helmet设置

```
// 服务端 Helmet设置
const helmet = Helmet.renderStatic();
const preloadedState = store.getState();

const helmetData = getHelmetData(helmet, preloadedState);
```

> 客户端SEO Helmet设置

```
<Helmet>
    <title>内容标题</title>
    <meta name="title" content="内容标题" />
    <meta name="keywords" content="内容keywords" />
    <meta name="description" content="内容decription" />
</Helmet>
```

## 2. 路由
### <span id="config">统一路由配置</span>
> 统一文件配置方便总览便于查找与维护

```
// ./src/routes/index.js

const routes = [
    {
        path: '/',
        component: Root,
        routes: [
            {
                path: '/pageA/:id',
                component: PageA,
                exact: true
            },
            {
                path: '/pageB/:id',
                component: PageB
            }
        ]
    }
]
```

> 头部与导航栏

```
// ./src/routes/index.js
{
        path: '/',
        component: Root,
        routes: [
            {
                path: '/pageA/:id',
                component: PageA,
                exact: true,
                layout: {
                    hasNav: false // 控制左侧导航栏，默认true
                    hasHeader: true // 控制头部header展示，默认true
                }
            },
            {
                path: '/pageB/:id',
                component: PageB
            }
        ]
    }
```


### <span id="code-spilt">代码分割及按需加载</span>
> 利用webpack loadable-components做代码分割

```
// ./src/routes/index.js

const routes = [
    {
        component: Root,
        path: '/',
        routes: [
            {
                path: '/pageA/:id',
                component: getComponent(require('../containers/PageA').default, Loadable({
                    loader: () => import('../containers/PageA'),
                    loading: _ => null,
                    modules: ['../containers/PageA']
                })),
                exact: true,
                dependence: VIDEOJS, // 第三方库路径脚本
                moduleName: 'PageA',
                noRedirect: true, // 禁止重定向到m端
            }
        ]
    }
];
```

## 3. 模块注册
### <span id="module">模块注册</span>
> 模块在redux中以key为名储存全局state，且一般含有对应的sagas。

例子 PageA.js
```
import prefetchSaga from './prefetch';

// connect 装饰器
@connect(mapStateToProps, mapDispatchToProps)
class PageA extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 服务端渲染必须
    static prefetch = prefetchSaga;
}

export default PageA;
```

例子 prefetch.js
```
import * as GlobalActionTypes from 'Global/actions';

function* funcA(action) {
    try {
        const res = yield call(Api.funcA);
        yield put(ActionTypes.funcA.success(action, res));

        // 设置访问为SSR
        yield put(GlobalActionTypes.prefetchSet());
    } catch (error) {
        yield put(ActionTypes.funcA.failure(action, error));
    }
}

export default function* PageAPrefetch(args) {
    yield fork(funcA, args);
}
```


> 全局注册reducer, saga, 结合route的moduleName属性配置

```
./rootReducers.js
./rootSagas.js
```


## <span id="hoc">Higher Order Component</span>
> 添加hoc文件夹用于存放HOC组件

> 请善用[HOC](https://reactjs.org/docs/higher-order-components.html#___gatsby)提高代码可读性


## 方便的设置
### <span id="alias">alias</span>

> 节省路径记忆负担（同时会丢失ide重定向）

```
// webpack
resolve: {
    alias: {
        Public: path.resolve(__dirname, '../src/view/statics'),
        Components: path.resolve(__dirname, '../src/view/components'),
        Containers: path.resolve(__dirname, '../src/view/containers'),
        Global: path.resolve(__dirname, '../src/view/global'),
        Utils: path.resolve(__dirname, '../src/view/utils'),
        Hoc: path.resolve(__dirname, '../src/view/hoc'),
        Services: path.resolve(__dirname, '../src/view/services'),
        View: path.resolve(__dirname, '../src/view')
    }
},

// somewhere
import { login } from 'Global/actions';
```

## 测试

### <span id="start-ssr">start-ssr</span>
本地运行ssr
```
$ npm start-ssr
```
定位ssr问题有：
1. 本地运行ssr
2. 本地打包，然后在`dist`目录下运行`node server/server-gdtv.js`
3. 找海哥要日志

### <span id="jest">jest</span>

1. [Document of jest](https://facebook.github.io/jest/docs/en/getting-started.html)

```
$ npm test
```

### <span id="enzyme">enzyme</span>

[Document of enzyme](http://airbnb.io/enzyme/docs/api/render.html)

