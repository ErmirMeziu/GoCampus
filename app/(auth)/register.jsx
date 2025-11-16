
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { useTheme, toOpacity } from "../../context/ThemeProvider";
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";


import PasswordInput from "../../components/PasswordInput";

import { validateRegistration, registerUser } from "../../auth/auth";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
    const { theme, isDarkMode } = useTheme();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        setLoading(true);
          const loweredEmail = email.trim().toLowerCase();

        const validationError = validateRegistration(
            fullName,
            loweredEmail,
            password,
            confirm
        );

        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        const result = await registerUser(loweredEmail, password, fullName);

        if (!result.ok) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        setTimeout(() => router.replace("/home"), 300);
    };
    

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                        <Text style={[styles.title, { color: theme.textPrimary }]}>
                            Create Account
                        </Text>

                        <GlassView intensity={40} style={styles.formCard}>
                            {error !== "" && <Text style={styles.errorText}>{error}</Text>}

                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor={theme.textMuted}
                                style={[styles.input, { color: theme.textPrimary, borderColor: toOpacity(theme.textPrimary, 0.3), borderWidth: 1, }]}
                                value={fullName}
                                onChangeText={setFullName}
                            />

                            <TextInput
                                placeholder="Email"
                                placeholderTextColor={theme.textMuted}
                                style={[styles.input, { color: theme.textPrimary, borderColor: toOpacity(theme.textPrimary, 0.3),borderWidth:1,}]}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <PasswordInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                theme={theme}
                            />

                            <PasswordInput
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholder="Confirm Password"
                                theme={theme}
                            />

                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.primaryBtnText}>Register</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkWrapper}
                                onPress={() =>
                                    setTimeout(() => router.replace("/login"), 300)
                                }
                            >
                                <Text style={[styles.linkText, { color: theme.textMuted }]}>
                                    Already have an account?{" "}
                                    <Text style={{ color: theme.primary, fontWeight: "600" }}>
                                        Login
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </GlassView>
                    </View>
                </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
    },
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
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        fontSize: 15,

    },
    primaryBtn: {
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    linkWrapper: { marginTop: 16, alignItems: "center" },
    linkText: { fontSize: 14 },
    errorText: {
        color: "#ff4d4d",
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
    },
});
