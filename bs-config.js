/**
 * Require Browsersync along with webpack and middleware for it
 */
var webpack              = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

/**
 * Require ./webpack.config.js and make a bundler from it
 */
var webpackConfig = require('./webpack.config');

webpackConfig.plugins = webpackConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

webpackConfig.debug = true;
webpackConfig.devtool = "#eval-source-map";
webpackConfig.entry = webpackConfig.entry.concat([
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
]);

var bundler = webpack(webpackConfig);

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
module.exports = {
    server: 'test/fixtures',
    //watchOptions: {
    //    usePolling: true
    //},
    plugins: ['/Users/shaneobsourne/code/UI'],
    middleware: [
        webpackDevMiddleware(bundler, {
            // IMPORTANT: dev middleware can't access config, so we should
            // provide publicPath by ourselves
            publicPath: webpackConfig.output.publicPath,

            // pretty colored output
            stats: { colors: true }

            // for other settings see
            // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),
        webpackHotMiddleware(bundler)
    ]
};