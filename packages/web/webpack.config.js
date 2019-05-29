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
            loader: 'babel-loader'
        }]
    }
}