// import serverRender from './render/serverRender';

require('@babel/polyfill');

// gizp
const compression = require('compression');
const path = require('path');
const Express = require('express');
const fs = require('fs');
const http = require('http');
const uuid = require('uuid/v1');
const logInit = require('./utils/logs');

const app = new Express();

app.use(compression({ threshold: 0, level: 9 }));
app.use('/server', Express.static('server'));
app.use('/html', Express.static('./dist/html'));
app.use('/images', Express.static('./dist/server/images'));
app.use('/js', Express.static('./dist/html/js'));
app.use('/css', Express.static('./dist/html/css'));
app.use('/sourceMaps', Express.static('./dist/html/sourceMaps'));
app.use('/favicon.ico', Express.static('./dist/html/favicon.ico'));

// 获取请求IP
const getClientIp = function (request) {
    const ip = request.headers['x-forwarded-for']
        || request.ip
        || (request.connection && request.connection.remoteAddress)
        || (request.socket && request.socket.remoteAddress)
        || (request.connection && request.connection.socket && request.connection.socket.remoteAddress) || '';
    if (ip && ip.indexOf(':') != -1) {
        return ip.split(':')[3] || '127.0.0.1';
    }
    return ip;
};


// 设置全局Cookie
app.use(function (req, res, next) {
    if (!req.cookies || !req.cookies.DEVICEID) {
        const deviceId = `WEB_${uuid()}`;
        const d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        res.cookie('DEVICEID', deviceId, { expires: d });
        global.__DEVICEID__ = deviceId;
        global.__X_FORWARDED_FOR__ = getClientIp(req);
    } else {
        global.__DEVICEID__ = req.cookies.DEVICEID;
    }
    next();
});

app.get('/*', (req, res) => {
    // 初始化日志打印
    logInit();

    console.log('server render start...', req.url);

    try {
        const serverRender = require('./render/serverRender');
        serverRender(req, res);
    } catch (error) {
        global.logger.error(error);
    }
});

const PORT = 3084;
const httpServer = http.createServer(app);

httpServer.listen(PORT, function httpSev() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
