import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";

export default function EventCard({ item, theme }) {
    return (
        <GlassView
            glassEffectStyle="clear"
            intensity={60}
            style={[styles.eventCard, { backgroundColor: theme.card }]}
        >
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventBody}>
                <Text
                    style={[styles.eventTitle, { color: theme.textPrimary }]}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
                <Text
                    style={[styles.eventMeta, { color: theme.textMuted }]}
                    numberOfLines={1}
                >
                    📅{" "}
                    {new Date(item.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                    })}{" "}
                    • {item.time || "—"} • 📍 {item.location || "TBA"}
                </Text>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    eventCard: { width: 240,borderRadius: 16, marginRight: 12,overflow: "hidden",},
    eventImage: { width: "100%",height: 110, },
    eventBody: {padding: 10, },
    eventTitle: { fontWeight: "700", fontSize: 14,},
    eventMeta: { fontSize: 11, marginTop: 4, },
});