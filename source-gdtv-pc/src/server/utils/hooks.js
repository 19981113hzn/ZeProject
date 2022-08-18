const lessParser = require('postcss-less').parse;

const hooks = () => {
    require('@babel/polyfill');

    // Javascript require hook
    require('@babel/register')({
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
            // 'add-module-exports',
            // 'loadable-components/babel',
            // '@babel/plugin-syntax-dynamic-import',
            // '@babel/plugin-transform-runtime',
            // '@babel/plugin-transform-modules-commonjs',
            // '@babel/plugin-proposal-object-rest-spread',
            // '@babel/plugin-proposal-export-default-from',
            // ['@babel/plugin-proposal-optional-chaining', { loose: true }],
            // ['@babel/plugin-proposal-decorators', { legacy: true }],
            // ['@babel/plugin-proposal-class-properties', { loose: true }]
        ]
    });

    require('css-modules-require-hook')({
        extensions: ['.less'],
        camelCase: true,
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        processorOpts: {parser: lessParser}
    });

    require('css-modules-require-hook')({
        extensions: ['.css'],
        camelCase: true,
        generateScopedName: '[name]__[local]___[hash:base64:5]'
    });

    // Image require hook
    require('asset-require-hook')({
        name: 'images/[name][hash:8].[ext]',
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'ico', 'woff', 'woff2', 'eot', 'ttf', 'svg', 'swf'],
        limit: 4000
    });
};

module.exports = hooks;
