const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const base = require('./webpack.config.base');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const getStyleLoaders = require('./utils').getStyleLoaders;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

const config = {
    entry: path.join(__dirname, '../src/server/server.prod'),

    output: {
        path: path.join(__dirname, '../dist/server'),
        filename: 'server-gdtv.js',
        publicPath: '/'
    },

    target: 'node',

    node: {
        __filename: true,
        __dirname: true
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader'
                },
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.css$/,
                use: getStyleLoaders({
                    importLoaders: 1,
                    modules: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }),
                include: path.join(__dirname, '../src'),
            },
            {
                test: /\.css$/,
                use: [
                    'css-loader',
                    'postcss-loader'
                ],
                include: [
                    path.join(__dirname, '../node_modules/swiper/dist/css'),
                    path.join(__dirname, '../node_modules/@itouchtv/touchtv-html-parser/dist/css'),
                    // path.join(__dirname, '../node_modules/cropperjs/dist')
                ]
            },
            {
                test: /\.less$/,
                use: getStyleLoaders(
                    {
                        modules: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]',
                        importLoaders: 1
                    },
                    'less-loader'
                ),
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|svg|swf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        videojs: 'videojs'
    },
    plugins: [
        new ReactLoadablePlugin({
            filename: './dist/react-loadable.json',
        }),
        // new ExtractTextPlugin({
        //     filename: 'css/[name]_[hash:8].css',
        // }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[hash:8].css',
            chunkFilename: 'css/[name]_[hash:8].chunk.css'
        }),
        new OptimizeCss({}),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        })
    ]
};

module.exports = config;
