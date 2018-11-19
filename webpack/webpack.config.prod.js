const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: 'bundle.js' 
    },
    mode: 'production',
    target: "electron-renderer"
});