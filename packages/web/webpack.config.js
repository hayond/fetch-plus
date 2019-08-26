const webpack = require('webpack')

const CWD = process.cwd()

module.exports = {
    entry: {
        index: './src/index'
    },
    output: {
        path: `${CWD}/dist`,
        library: 'FetchPlus',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/i,
            loader: 'babel-loader',
            options: {
                "presets": [
                    ["@babel/preset-env", {
                        "targets": "last 2 versions"
                    }]
                ]
            }
        }]
    },
    optimization: {
        minimize: false
    }
}