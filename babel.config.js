module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel', 'nativewind/babel'],
  };
};
// This is the babel configuration file for a React Native project using Expo.
// It uses the 'babel-preset-expo' preset for Expo projects and includes the 'nativewind/babel' plugin for Tailwind CSS support in React Native.
// The 'api.cache(false)' line disables caching for the Babel configuration, which can be useful during development to ensure that changes are picked up immediately.
