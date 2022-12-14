const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: cssOptions
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009'
                        },
                        stage: 3
                    })
                ]
            }
        }
    ]
    if (isDev) {
        loaders.unshift(require.resolve('css-hot-loader'))
    }
    if (preProcessor) {
        // 添加额外的loader
        loaders.push(require.resolve(preProcessor))
    }
    return loaders
}
module.exports = {
    getStyleLoaders
}
