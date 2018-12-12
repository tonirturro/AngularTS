const merge = require('webpack-merge');
const webpackDevConfig = require('./webpack.config.dev');

module.exports = merge(webpackDevConfig, {
    module: {
        rules: [{
            enforce: 'post',
            test: /\.ts$/,
            exclude: /node_modules|\.spec.ts$/,
            loader: 'istanbul-instrumenter-loader'
        }],
    }
});