import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditSettingModal({ visible, theme, currentSetting, editValue, setEditValue, onClose, onSave }) {
    const getInputPlaceholder = (type) => {
        switch (type) {
            case "email": return "Enter your email";
            case "phone": return "Enter your phone number";
            case "password": return "Enter new password";
            case "date": return "YYYY-MM-DD";
            default: return `Enter your ${currentSetting?.key}`;
        }
    };

    const getKeyboardType = (type) => {
        switch (type) {
            case "email": return "email-address";
            case "phone": return "phone-pad";
            case "number": return "numeric";
            default: return "default";
        }
    };

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <SafeAreaView style={styles.modalOverlay}>
                <GlassView style={styles.modalContent} intensity={90}>
                    <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{currentSetting?.title}</Text>
                    <TextInput
                        style={[styles.textInput, { color: theme.textPrimary, borderColor: theme.border }]}
                        value={editValue}
                        onChangeText={setEditValue}
                        placeholder={getInputPlaceholder(currentSetting?.type)}
                        placeholderTextColor={theme.textMuted}
                        keyboardType={getKeyboardType(currentSetting?.type)}
                        secureTextEntry={currentSetting?.type === "password"}
                        autoCapitalize="none"
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]} onPress={onClose}>
                            <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onSave}>
                            <Text style={[styles.buttonText, { color: "#fff" }]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </GlassView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.32)", padding: 20 },
    modalContent: { width: "100%", borderRadius: 20, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, textAlign: "center" },
    textInput: { borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24, borderWidth: 1 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between" },
    button: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginHorizontal: 6 },
    buttonText: { fontSize: 16, fontWeight: "600" },
});
