
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from "react-native";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordInput from "./PasswordInput";


export default function ChangePasswordModal({
    visible,
    theme,
    onClose,
    onChangePassword,
}) {

    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");

    const handleSave = () => {
        setError("");

        if (!currentPass || !newPass || !confirmPass) {
            setError("All fields are required.");
            return;
        }

        if (newPass.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (newPass !== confirmPass) {
            setError("Passwords do not match.");
            return;
        }

        onChangePassword(currentPass, newPass, setError);
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <SafeAreaView style={styles.overlay}>
                <GlassView intensity={95} style={[styles.modal, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.textPrimary }]}>
                        Change Password
                    </Text>

                    <PasswordInput
                        value={currentPass}
                        onChangeText={setCurrentPass}
                        placeholder="Current Password"
                        theme={theme}
                    />

                    <PasswordInput
                        value={newPass}
                        onChangeText={setNewPass}
                        placeholder="New Password"
                        theme={theme}
                    />

                    <PasswordInput
                        value={confirmPass}
                        onChangeText={setConfirmPass}
                        placeholder="Confirm New Password"
                        theme={theme}
                    />

                    {!!error && <Text style={styles.error}>{error}</Text>}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]} onPress={onClose}>
                            <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSave}>
                            <Text style={[styles.buttonText, { color: "#fff" }]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </GlassView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
        paddingHorizontal: 20,
    },
    modal: {
        width: "100%",
        borderRadius: 20,
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
    },
    error: {
        color: "#ff4d4f",
        textAlign: "center",
        marginBottom: 12,
        marginTop: 4,
        fontSize: 13,
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 18,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
