const path = require('path');
const webpack = require('webpack');

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

const baseCSSLoader = [
    {
        loader: 'css-loader',
        options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]',
            sourceMap: !!isProd
        }
    },
    {
        loader: 'postcss-loader'
    }
];

const baseNotCSSModuleLoader = [
    {
        loader: 'css-loader',
        options: {
            sourceMap: !!isProd
        }
    },
    {
        loader: 'postcss-loader'
    }
];

const baseConfig = {
    mode: isProd ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, '../dist/html'),
        publicPath: '/dist/html/',
        filename: '[name].[hash:8].js',
        // chunkFilename: 'js/chunks/[name][hash:8].js',
        sourceMapFilename: 'sourceMaps/[name][hash:8].map'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            Public: path.resolve(__dirname, '../src/view/statics'),
            Components: path.resolve(__dirname, '../src/view/components'),
            Constants: path.resolve(__dirname, '../src/view/constants'),
            Containers: path.resolve(__dirname, '../src/view/containers'),
            Global: path.resolve(__dirname, '../src/view/global'),
            Utils: path.resolve(__dirname, '../src/view/utils'),
            Hoc: path.resolve(__dirname, '../src/view/hoc'),
            Services: path.resolve(__dirname, '../src/view/services'),
            View: path.resolve(__dirname, '../src/view'),
            swiper: 'swiper/dist/js/swiper.js'
        }
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [
            {
                loader: 'eslint-loader',
                test: /.js$/,
                enforce: 'pre',
                include: path.join(__dirname, '..', 'src'),
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }
        ]
    },
    externals: {
        videojs: 'videojs'
    },
    plugins: [
        ...isProd ? [] : [
            new FriendlyErrorsPlugin()
        ]
    ]
};

module.exports = {
    baseConfig,
    baseCSSLoader,
    baseNotCSSModuleLoader
};
