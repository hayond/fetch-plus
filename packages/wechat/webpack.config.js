const webpack = require('webpack')

const CWD = process.cwd()

module.exports = {
    entry: {
        FetchPlusPonyfill: './src/FetchPlusPonyfill'
    },
    output: {
        path: `${CWD}/dist`,
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
            test: /\.m?js$/i,
            loader: 'babel-loader',
            options: {
                "plugins": [
                    "@babel/plugin-transform-runtime",
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-transform-destructuring",
                    "@babel/plugin-transform-async-to-generator",
                    "@babel/plugin-transform-regenerator",
                    "@babel/plugin-transform-modules-commonjs"
                ]
            },
        }]
    },
    optimization: {
        minimize: false
    }
}