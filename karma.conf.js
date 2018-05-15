// Karma configuration
// Generated on Tue Mar 21 2017 21:29:48 GMT+0100 (Romance Standard Time)

module.exports = function (config) {
    config.set({

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        files: [
            // application
            "wwwroot/App/Boot.ts",

            // 3rd-party resources
            "node_modules/angular-mocks/angular-mocks.js",

            // test files
            "wwwroot/App/**/*.spec.ts"
        ],

        preprocessors: {
            "wwwroot/App/**/*.ts": ["webpack"]
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.htm$/,
                        use: ["html-loader"]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            'css-loader'
                        ]
                    },
                    {
                        test: /\.(eot|ttf|woff|woff2|svg)$/,
                        use: 'file-loader'
                    },
                    {
                        test: /\.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }        
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

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