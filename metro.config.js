const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Suporte a arquivos .cjs (CommonJS)
defaultConfig.resolver.sourceExts.push('cjs');

// Corrige erro de exportação de pacotes (como no Firebase)
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
