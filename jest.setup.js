import "@testing-library/jest-native/extend-expect";

jest.mock("expo-glass-effect", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    GlassView: ({ children, ...props }) => React.createElement(View, props, children),
  };
});


jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }) => React.createElement(Text, null, name),
  };
});

jest.mock("./context/ThemeProvider", () => ({
  toOpacity: (c) => c,
}));
