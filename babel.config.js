module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Certifique-se de que este plugin seja o último na lista
      'react-native-reanimated/plugin',
    ],
  };
};