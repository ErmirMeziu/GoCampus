import React from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";

export default function SettingsList({ settings = [], userData = {}, theme, onPress }) {
    if (!Array.isArray(settings)) return null;

    return (
        <GlassView style={styles.glassCard} intensity={80} blurAmount={25}>
            {settings.map((item, index) => {
               
                const subtitle = item.subtitle ?? "";

                const toggleValue = userData[item.key] ?? false;

                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.listItem,
                            { borderColor: theme.border },
                            index === settings.length - 1 && styles.lastItem,
                        ]}
                        onPress={() => onPress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.listItemLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
                                <Ionicons name={item.icon} size={20} color={theme.textPrimary} />
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={[styles.primaryText, { color: theme.textPrimary }]}>
                                    {item.title}
                                </Text>

                                <Text style={[styles.secondaryText, { color: theme.textMuted }]}>
                                    {String(subtitle)}
                                </Text>
                            </View>
                        </View>

                        {item.type === "toggle" ? (
                            <Switch
                                value={toggleValue}
                                onValueChange={() => onPress(item)}
                                trackColor={{ false: "#767577", true: theme.success }}
                                thumbColor={toggleValue ? "#fff" : "#f4f3f4"}
                            />
                        ) : (
                            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </GlassView>
    );
}

const styles = StyleSheet.create({
    glassCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 8,
        marginBottom: 20,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
    },
    lastItem: { borderBottomWidth: 0 },
    listItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: { flex: 1 },
    primaryText: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
    secondaryText: { fontSize: 12 },
});
