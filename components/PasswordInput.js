
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toOpacity } from "../context/ThemeProvider";

export default function PasswordInput({
    value,
    onChangeText,
    placeholder,
    theme,
    error,
}) {
    const [show, setShow] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={theme.textMuted}
                style={[
                    styles.input,
                    { color: theme.textPrimary,borderColor: toOpacity(theme.textPrimary, 0.3),borderWidth:1, },
                    error && { borderColor: "#ff4d4f", borderWidth: 1 },
                ]}
                secureTextEntry={!show}
                value={value}
                onChangeText={onChangeText}
            />

            <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShow(!show)}
            >
                <Ionicons
                    name={show ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.textPrimary}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",marginBottom: 12,
      
    },
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingRight: 45,
        backgroundColor: "rgba(255,255,255,0.12)",
        fontSize: 15,
    },
    eyeBtn: {
        position: "absolute",
        right: 12,
        top: 12,
        padding: 4,
    },
});
