// Karma configuration
// Generated on Tue Mar 21 2017 21:29:48 GMT+0100 (Romance Standard Time)

module.exports = function (config) {
    config.set({

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', "karma-typescript"],

        files: [
            { pattern: "wwwroot/App/**/*.ts" }
        ],

        preprocessors: {
            "wwwroot/App/**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json"    
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', "karma-typescript"],

        // web server port
        port: 9876,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome']
    });
};