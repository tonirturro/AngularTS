const path = require('path');

module.exports = {
    entry: './wwwroot/App/Boot.ts',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist/bundle')
    },
    resolve: {
        extensions: ['.ts' ]
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'ts-loader?configFileName=tsconfig.webpack.json'
            }
        ]
    }
};