import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";
import EventCard from "./EventCard";

export default function GroupDetail({ group, onBack, theme, events, onJoinToggle, onCreateEvent }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Image source={{ uri: group.image }} style={styles.cover} />

            <View style={styles.body}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>{group.name}</Text>
                <Text style={[styles.desc, { color: theme.textMuted }]}>{group.description}</Text>

                <View style={styles.tagsRow}>
                    {group.tags.map((t, i) => (
                        <View
                            key={i}
                            style={[
                                styles.tag,
                                { borderColor: theme.border, backgroundColor: theme.overlay },
                            ]}
                        >
                            <Text style={{ color: theme.textPrimary, fontSize: 11 }}>{t}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                        onPress={onCreateEvent}
                    >
                        <Ionicons name="calendar-outline" size={18} color="#fff" />
                        <Text style={styles.actionText}>Add Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.danger }]}
                        onPress={onJoinToggle}
                    >
                        <Ionicons name="log-out-outline" size={18} color="#fff" />
                        <Text style={styles.actionText}>Leave Group</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Events</Text>

                <FlatList
                    data={events}
                    keyExtractor={(e) => e.id}
                    renderItem={({ item }) => <EventCard item={item} theme={theme} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text
                            style={{
                                color: theme.textMuted,
                                marginLeft: 12,
                                marginTop: 8,
                            }}
                        >
                            No upcoming events.
                        </Text>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backBtn: {position: "absolute",top: 40,left: 20,zIndex: 10,backgroundColor: "rgba(0,0,0,0.4)",padding: 8,borderRadius: 20,},
    cover: { width: "100%", height: 240 },
    body: { padding: 16 },
    title: { fontSize: 22, fontWeight: "700" },
    desc: { marginTop: 8, fontSize: 13, lineHeight: 18 },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
    tag: { paddingHorizontal: 10, paddingVertical: 6,borderRadius: 12,marginRight: 8,marginBottom: 6, borderWidth: 1,},
    actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    actionBtn: {flexDirection: "row",alignItems: "center", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12},
    actionText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 10 },
});