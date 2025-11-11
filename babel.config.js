module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin', [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@components': './src/components',
                        '@screens': './src/screens',
                        '@services': './src/services',
                        '@utils': './src/utils',
                        '@navigation': './src/navigation'
                    }
                }
            ]
        ],
    };
};