module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // For NativeWind
      "nativewind/babel", // For NativeWind support
    ],
    plugins: [
      "react-native-reanimated/plugin", // MUST be the last plugin
    ],
  };
};
