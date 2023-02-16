const { merge } = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    cache: {
        type: 'filesystem',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify('development')
        })
    ]
});
