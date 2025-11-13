// app/(auth)/welcome.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeProvider";   // FIXED
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { theme, isDarkMode } = useTheme();

  return (
    <ImageBackground
      source={
        isDarkMode
          ? require("../../assets/backgrounds/dark.png")   // FIXED PATH
          : require("../../assets/backgrounds/light.png")  // FIXED PATH
      }
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <View style={styles.container}>

        {/* Logo */}
        <GlassView intensity={50} style={styles.logoContainer}>
          <Image
            source={require("../../assets/img/gocampus.png")}  // FIXED PATH
            style={styles.logo}
            resizeMode="contain"
          />
        </GlassView>

        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          GoCampus
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textMuted }]}>
          Connect, learn, and grow with your campus community. Discover events,
          join study groups, and stay updated — all in one place.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>

          {/* LOGIN */}
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/login")}   // FIXED
          >
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          {/* REGISTER */}
          <TouchableOpacity
            style={[styles.registerBtn, { borderColor: theme.primary }]}
            onPress={() => router.push("/register")}  // FIXED
          >
            <Text style={[styles.registerBtnText, { color: theme.primary }]}>
              Register
            </Text>
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <Text style={[styles.tagline, { color: theme.textMuted }]}>
          Your campus, your network.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 32,
    justifyContent: "space-between",
    paddingBottom: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "white",
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginHorizontal: 20,
    marginTop: 16,
    opacity: 0.9,
  },
  buttonContainer: {
    marginTop: 40,
  },
  loginBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  registerBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  registerBtnText: {
    fontSize: 17,
    fontWeight: "600",
  },
  tagline: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
