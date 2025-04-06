module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      // Remove the expo-splash-screen plugin from here
      // 'module:expo-splash-screen', <-- Remove this line
    ],
  };
};
