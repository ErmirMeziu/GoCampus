
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
import { useTheme } from "../../context/ThemeProvider";

import { router } from "expo-router";
import LottieView from "lottie-react-native";


const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { theme, isDarkMode } = useTheme();

  return (

    <ImageBackground
      source={
        isDarkMode
          ? require("../../assets/backgrounds/dark.png")
          : require("../../assets/backgrounds/light.png")
      }
      style={styles.background}
      resizeMode="cover"

    >

      <LottieView
        source={require("../../assets/snow2.json")}
        autoPlay
        loop
        resizeMode="cover"

        style={styles.snow}
      />



      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />


      <View style={styles.container}>

        <View intensity={50} style={[styles.logoContainer,]}>
          <Image
            source={require("../../assets/pngegg.png")}
            style={styles.hat}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/gocampus1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>


        <Text style={[styles.title, { color: theme.textPrimary }]}>
          GoCampus
        </Text>

        <Text style={[styles.description, { color: theme.textMuted }]}>
          Connect, learn, and grow with your campus community. Discover events,
          join study groups, and stay updated — all in one place.
        </Text>

        <View style={styles.buttonContainer}>


          <TouchableOpacity
            onPress={() => router.push("/login")}
            activeOpacity={0.85}
          >
            <ImageBackground
              source={require("../../assets/buttonback.png")}
              resizeMode="stretch"
              style={styles.loginBtn}
              imageStyle={{ borderRadius: 16 }}
            >
              <Text style={styles.loginBtnText}>Log In</Text>
            </ImageBackground>
          </TouchableOpacity>

         <TouchableOpacity
            style={[styles.registerBtn, { borderColor: "#8d0606",borderWidth:2  }]}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerBtnText}>
              Register
            </Text>
          </TouchableOpacity>


        </View>


        <Text style={[styles.tagline, { color: theme.textMuted }]}>
          Your campus, your network.™
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
    overflow: "show",
    borderWidth: 2,

    backgroundColor: "white",
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "white",
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
    color: "#fff",
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
  snow: {
    position: "absolute",
    top: 0,
    left: 35,
    right: 0,
    bottom: 0,

  },

  hat: {
    position: "absolute",

    left: "21%",
    width: 140,
    height: 140,
    transform: [{ translateX: -35 }, { rotate: "-12deg" }],
    zIndex: 10,
  },


});
