const path = require('path');

module.exports = {
    mode: 'development',
    entry: './wwwroot/App/Boot.ts',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist/bundle')
    },
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
    },
    devtool: 'inline-source-map'
}