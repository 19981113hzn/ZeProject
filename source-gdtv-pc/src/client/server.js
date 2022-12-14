const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const fs = require('fs');
const path = require('path');
const http = require('http');
const Express = require('express');
const compression = require('compression'); // gizp
const webpackconfig = require('../../config/webpack.dev.config');


const app = new Express();
const config = webpackconfig('client');
const compiler = webpack(config);
app.use(compression({ threshold: 0 }));

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
}));
app.use('/lib', Express.static(path.join(__dirname, './src/lib')));
app.use('/statics', Express.static(path.join(__dirname, './src/statics')));
app.use('/dll', Express.static(path.join(__dirname, '../../dll')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});


const PORT = 3988;
const httpServer = http.createServer(app);

httpServer.listen(PORT, function httpS() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
