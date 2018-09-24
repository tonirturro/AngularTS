// Karma configuration
// Generated on Tue Mar 21 2017 21:29:48 GMT+0100 (Romance Standard Time)
const path = require('path');
const webpackConfig = require('../webpack/webpack.config.test');
webpackConfig.resolve.alias = {
    'angular': path.resolve(path.join(__dirname, '..', 'node_modules', 'angular'))
};

module.exports = function (config) {
    config.set({

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        files: [
            "unitFrontend.js"
        ],

        preprocessors: {
            "unitFrontend.js": ["webpack", "sourcemap"]
        },

        webpack: webpackConfig,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage-istanbul'],

        coverageIstanbulReporter: {
            dir: './coverage',
            subdir: function (browser) {
              return browser.toLowerCase().split(/[ /-]/)[0];
            },
            fixWebpackSourcePaths: true,
        },        

        // web server port
        port: 9876,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        mime: {
            'text/x-typescript': ['ts']
        }
    });
};