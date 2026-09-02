const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro's package-exports resolution currently breaks named exports (e.g. getAuth)
// from the firebase JS SDK - disable it until upstream is fixed.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
