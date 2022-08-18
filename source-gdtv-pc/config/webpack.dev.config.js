const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const base = require('./webpack.config.base');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const getStyleLoaders = require('./utils').getStyleLoaders
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin

const ENTRY_ARR = ['@babel/polyfill', path.join(__dirname, '../src/client/index.js')];

const config = (type) => merge(base.baseConfig, {
    mode: 'development',
    entry: {
        client: type === 'server' ? ENTRY_ARR : ['webpack-hot-middleware/client?reload=true', ...ENTRY_ARR]
    },

    output: {
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader?cacheDirectory=true'
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
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
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
                sideEffects: true,
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

    performance: {
        maxEntrypointSize: 300000,
        hints: false
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.__isServer__': type === 'server' ? 'true' : 'false'
        }),
        new ReactLoadablePlugin({
            filename: './dist/react-loadable.json',
        }),
        // https://github.com/ant-design/ant-design/issues/17622
        new LodashModuleReplacementPlugin({ paths: true }),
        // new BundleAnalyzerPlugin(),
        // webpack热更新组件
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        }),

        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: '/html/'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].chunk.css'
        })

        // new webpack.DllReferencePlugin({
        //     manifest: require('../dll/vendor-manifest.json')
        // }),
    ],

    optimization: {
        usedExports: true,
        minimize: true,
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                // common: {
                //     name: "commons",
                //     chunks: "all",
                //     minSize: 1,
                //     priority: 0
                // },
                // 首先: 打包node_modules中的文件
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                }
            }
        }
    }
});

module.exports = config;
