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
import { useTheme } from "../../context/ThemeProvider";
import { GlassView } from "expo-glass-effect";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";


// Firebase helpers
import {
    validateRegistration,
    registerUser,
} from "../../firebase/auth";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------- NAME VALIDATION ----------------
    const validateName = () => {
        if (!fullName.trim()) return "Full name cannot be empty.";
        if (fullName.trim().length < 3)
            return "Full name must be at least 3 characters.";
        if (!/^[a-zA-Z\s]+$/.test(fullName.trim()))
            return "Full name can only contain letters.";
        return null;
    };

    // ---------------- REGISTER ----------------
    const handleRegister = async () => {
        setError("");
        setLoading(true);

        // validate name
        const nameError = validateName();
        if (nameError) {
            setError(nameError);
            setLoading(false);
            return;
        }

        // validate email + pass
        const validationError = validateRegistration(email, password, confirm);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        // try to register
        const result = await registerUser(email, password);

        if (!result.ok) {
            setError(result.error);
            setLoading(false);
            return;
        }

        // go home
        setLoading(false);
        setTimeout(() => {
            router.replace("/home");
        }, 300);
    };

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
                    <Text style={[styles.title, { color: theme.textPrimary }]}>
                        Create Account
                    </Text>

                    <GlassView intensity={40} style={styles.formCard}>
                        {error !== "" && <Text style={styles.errorText}>{error}</Text>}

                        {/* FULL NAME */}
                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor={theme.textMuted}
                            style={[styles.input, { color: theme.textPrimary }]}
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        {/* EMAIL */}
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={theme.textMuted}
                            style={[styles.input, { color: theme.textPrimary }]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        {/* PASSWORD */}
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={theme.textMuted}
                            style={[styles.input, { color: theme.textPrimary }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {/* CONFIRM PASSWORD */}
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.textMuted}
                            style={[styles.input, { color: theme.textPrimary }]}
                            value={confirm}
                            onChangeText={setConfirm}
                            secureTextEntry
                        />

                        {/* REGISTER BUTTON */}
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
                            onPress={() => setTimeout(() => router.replace("/login"), 300)}

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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
    title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20 },
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
