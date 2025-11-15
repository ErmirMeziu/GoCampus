import 'dotenv/config';

export default {
  expo: {
    scheme: "gocampus",
    name: "GoCampus",
    slug: "GoCampus",
    version: "1.0.0",

    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: ["expo-router"],

    extra: {
      defaultThemePreference: "light",

      EXPO_PUBLIC_OPENROUTER_KEY: process.env.EXPO_PUBLIC_OPENROUTER_KEY,
    },
  }
};
