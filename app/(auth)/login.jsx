// app/(auth)/login.jsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "../../context/ThemeProvider";
import { router, usePathname } from "expo-router";

import { auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { loginWithEmail } from "../../firebase/auth";
import { loginWithGitHub } from "../../auth/githubAuth";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
    const { theme, isDarkMode } = useTheme();  // ✔ Safe now because ThemeProvider wraps root
    const pathname = usePathname();            // ✔ Prevent auto-close

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const clearErrors = () => setErrors({});

    const friendlyError = (msg) => {
        if (msg.includes("auth/user-not-found")) return "No account found with this email.";
        if (msg.includes("auth/wrong-password")) return "Incorrect password.";
        if (msg.includes("auth/invalid-email")) return "Invalid email.";
        if (msg.includes("auth/account-exists-with-different-credential"))
            return "This email is already registered with a different login method.";
        return msg;
    };

    // ----------------------
    // 🔥 EMAIL LOGIN
    // ----------------------
    const handleEmailLogin = async () => {
        clearErrors();
        setSuccessMsg("");

        if (!email) setErrors((e) => ({ ...e, email: "Email is required." }));
        if (!password) setErrors((e) => ({ ...e, password: "Password is required." }));
        if (!email || !password) return;

        setLoading(true);
        try {
            const result = await loginWithEmail(email, password);

            if (!result.ok) {
                setErrors((e) => ({ ...e, email: friendlyError(result.error) }));
                return;
            }

            setSuccessMsg("Login successful!");
            setTimeout(() => router.replace("/home"), 300);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // 🔥 GITHUB LOGIN
    // ----------------------
    const handleGitHubLogin = async () => {
        clearErrors();
        setSuccessMsg("");

        const result = await loginWithGitHub();

        if (!result.ok) {
            setErrors((e) => ({ ...e, github: friendlyError(result.error) }));
            return;
        }

        setSuccessMsg("GitHub login successful!");
        setTimeout(() => router.replace("/home"), 300);
    };

    const isWeb = Platform.OS === "web";

    // ----------------------
    // 🔥 UI
    // ----------------------
    return (
        <ImageBackground
            source={
                isDarkMode
                    ? require("../../assets/backgrounds/dark.png")
                    : require("../../assets/backgrounds/light.png")
            }
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.inner}>
                    <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: theme.textMuted }]}>Sign in to continue</Text>

                    <GlassView intensity={45} style={styles.formCard}>

                        {/* EMAIL */}
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={theme.textMuted}
                            style={[
                                styles.input,
                                { color: theme.textPrimary },
                                errors.email && { borderColor: "#ff4d4f", borderWidth: 1 },
                            ]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        {/* PASSWORD + TOGGLE */}
                        <View style={styles.passContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={theme.textMuted}
                                style={[
                                    styles.input,
                                    styles.passwordInput,
                                    { color: theme.textPrimary },
                                    errors.password && { borderColor: "#ff4d4f", borderWidth: 1 },
                                ]}
                                secureTextEntry={!showPass}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowPass(!showPass)}
                            >
                                <Ionicons
                                    name={showPass ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color={theme.textPrimary}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        {/* LOGIN BUTTON */}
                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: loading ? "#999" : theme.primary }]}
                            onPress={handleEmailLogin}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.primaryBtnText}>Login</Text>
                            }
                        </TouchableOpacity>

                        <Text style={[styles.orText, { color: theme.textMuted }]}>
                            ─── or continue with ───
                        </Text>

                        {/* GITHUB LOGIN */}
                        {isWeb ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.socialBtn, { backgroundColor: "#333" }]}
                                    onPress={handleGitHubLogin}
                                >
                                    <Ionicons name="logo-github" size={22} color="#fff" />
                                    <Text style={styles.socialBtnText}>Continue with GitHub</Text>
                                </TouchableOpacity>

                                {errors.github && <Text style={styles.errorText}>{errors.github}</Text>}
                            </>
                        ) : (
                            <Text style={[styles.disabledText, { color: theme.textMuted }]}>
                                GitHub login is not available on this device.
                            </Text>
                        )}

                        {successMsg && <Text style={styles.successText}>{successMsg}</Text>}
                    </GlassView>

                    {/* REGISTER LINK */}
                    <TouchableOpacity
                        style={styles.linkWrapper}
                        onPress={() => router.push("/register")}
                    >
                        <Text style={[styles.linkText, { color: theme.textMuted }]}>
                            Don’t have an account?{" "}
                            <Text style={{ color: theme.primary, fontWeight: "600" }}>
                                Register
                            </Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ImageBackground>
    );
}

// ----------------------
// 🔥 STYLES
// ----------------------
const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },

    title: { fontSize: 28, fontWeight: "700", textAlign: "center" },
    subtitle: { fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 30 },

    formCard: {
        borderRadius: 20,
        padding: 20,
        width: width - 48,
        alignSelf: "center",
    },

    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255,255,255,0.12)",
        fontSize: 15,
    },

    passContainer: { position: "relative", width: "100%" },

    passwordInput: { paddingRight: 45, marginTop: 10 },

    eyeBtn: { position: "absolute", right: 12, top: 20 },

    primaryBtn: {
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },

    orText: { textAlign: "center", marginVertical: 16, fontSize: 12 },

    socialBtn: {
        height: 44,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    socialBtnText: { color: "#fff", marginLeft: 8, fontWeight: "600" },

    linkWrapper: { marginTop: 24, alignItems: "center" },
    linkText: { fontSize: 14 },

    errorText: {
        color: "#ff4d4f",
        fontSize: 12,
        marginBottom: 4,
        marginLeft: 4,
    },

    successText: {
        marginTop: 10,
        textAlign: "center",
        color: "#52c41a",
        fontWeight: "600",
    },

    disabledText: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 8,
    },
});
