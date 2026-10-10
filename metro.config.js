const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Bundle Drizzle SQL migration files as strings.
config.resolver.sourceExts.push("sql");

// Allow importing `.wasm` used by expo-sqlite on web (future desktop/web target).
config.resolver.assetExts.push("wasm");

module.exports = withNativeWind(config, { input: "./global.css" });
