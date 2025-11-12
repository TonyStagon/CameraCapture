const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
    env = {
        ...env,
        port: 5000,
    };

    const config = await createExpoWebpackConfigAsync(env, argv);

    if (!config.devServer) {
        config.devServer = {};
    }

    config.devServer.allowedHosts = 'all';
    config.devServer.host = '0.0.0.0';
    config.devServer.port = parseInt(process.env.WEB_PORT || process.env.PORT || '5000');

    if (!config.resolve) {
        config.resolve = {};
    }

    if (!config.resolve.fallback) {
        config.resolve.fallback = {};
    }

    config.resolve.fallback.crypto = require.resolve('crypto-browserify');
    config.resolve.fallback.stream = require.resolve('stream-browserify');
    config.resolve.fallback.vm = require.resolve('vm-browserify');

    return config;
};