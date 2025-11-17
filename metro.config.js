const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution for React Native
config.resolver.assetExts.push('txt');
config.resolver.assetExts.push('pdf');
config.resolver.assetExts.push('json');

// Disable unused resolver features for better performance
config.resolver.disableHierarchicalLookup = true;

module.exports = config;