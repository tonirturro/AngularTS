const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: 'server.js' 
    },
    target: 'node',
    mode: 'development',
    devtool: 'inline-source-map'
});