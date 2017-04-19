// Karma configuration
// Generated on Tue Mar 21 2017 21:29:48 GMT+0100 (Romance Standard Time)

module.exports = function (config) {
    config.set({

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular/angular-mocks.js',
            'Server/View/scripts/main.js',
            'spec/Frontend/**/*[sS]pec.js'
        ],



        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome']

    });
};
