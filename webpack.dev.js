var common = require('./webpack.common');
var path = require('path');
var webpack = require('webpack');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

common.devtool = 'eval';
common.entry = [
    'phaser-shim',
    // 'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'webpack-hot-middleware/client?reload=true&path=http://localhost:9214/__webpack_hmr',
    path.join(__dirname, './src/main.ts') // Your appʼs entry point
];
common.output.sourceMapFilename = '[file].map';
common.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackErrorNotificationPlugin(),
    new webpack.NoErrorsPlugin()
];

common.target = webpackTargetElectronRenderer(common);
module.exports = common;