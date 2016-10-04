var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var config = require('./webpack.dev');

const compiler = webpack(config);
const app = express();

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
}));

app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname));

app.listen(9214);