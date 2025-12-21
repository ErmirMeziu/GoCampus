
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { GlassView } from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";
import { router } from "expo-router";

const norm = (v) => (typeof v === "string" ? v.toLowerCase() : "");

function CourseCompanion({ resources = [], groups = [] }) {
    const { theme } = useTheme();

    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const key = submitted ? norm(query.trim()) : "";

    const matchedResources =
        key.length > 0
            ? resources.filter((r) =>
                norm(r?.title).includes(key) ||
                norm(r?.description || r?.desc || "").includes(key)
            )
            : [];

    const matchedGroups =
        key.length > 0
            ? groups.filter((g) => {
                const tags = Array.isArray(g?.tags)
                    ? g.tags.map(norm).join(" ")
                    : "";
                return (
                    norm(g?.name).includes(key) ||
                    norm(g?.description || "").includes(key) ||
                    tags.includes(key)
                );
            })
            : [];

    const reset = () => {
        setQuery("");
        setSubmitted(false);
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <GlassView
                intensity={45}
                glassEffectStyle="clear"
                style={[
                    styles.searchBar,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    },
                ]}
            >
                <Ionicons
                    name="search-outline"
                    size={18}
                    color={theme.textMuted}
                />

                <TextInput
                    placeholder="Quick search resources or groups"
                    placeholderTextColor={theme.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={() => setSubmitted(true)}
                    style={[styles.input, { color: theme.textPrimary }]}
                />

                {submitted && (
                    <TouchableOpacity onPress={reset}>
                        <Ionicons
                            name="close"
                            size={18}
                            color={theme.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </GlassView>

            {submitted && key.length > 0 && (
                <GlassView
                    intensity={50}
                    glassEffectStyle="clear"
                    style={[
                        styles.resultCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text style={[styles.header, { color: theme.textPrimary }]}>
                        Results for "{query}"
                    </Text>

                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                        📚 Resources
                    </Text>

                    {matchedResources.length === 0 ? (
                        <Text style={[styles.muted, { color: theme.textMuted }]}>
                            No resources found
                        </Text>
                    ) : (
                        matchedResources.slice(0, 5).map((r) => (
                            <TouchableOpacity
                                key={r.id}
                                style={styles.item}
                                onPress={() => {
                                    reset();

                                    router.push({
                                        pathname: "/(tabs)/resources",
                                        params: {
                                            scrollTo: r.id,
                                            clearSearch: "1",
                                        },
                                    });
                                }}


                            >
                                <Ionicons
                                    name="document-text-outline"
                                    size={14}
                                    color={theme.primary}
                                />
                                <Text
                                    style={[
                                        styles.itemText,
                                        { color: theme.textPrimary },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {r.title}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}

                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                        🧑‍🤝‍🧑 Groups
                    </Text>

                    {matchedGroups.length === 0 ? (
                        <Text style={[styles.muted, { color: theme.textMuted }]}>
                            No groups found
                        </Text>
                    ) : (
                        matchedGroups.slice(0, 5).map((g) => (
                            <TouchableOpacity
                                key={g.id}
                                style={styles.item}
                                onPress={() => {
                                    reset();
                                    router.push({
                                        pathname: "/(tabs)/groups",
                                        params: {
                                            scrollTo: g.id,
                                            clearSearch: "1",
                                        },
                                    })
                                }


                                }

                            >
                                <Ionicons
                                    name="people-outline"
                                    size={14}
                                    color={theme.primary}
                                />
                                <Text
                                    style={[
                                        styles.itemText,
                                        { color: theme.textPrimary },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {g.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </GlassView>
            )
            }

            <View style={{ height: 30 }} />
        </ScrollView >
    );
}

export default React.memo(CourseCompanion);

const styles = StyleSheet.create({
    searchBar: {
        marginHorizontal: 16,
        marginBottom: 0,
        marginTop: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,

        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",

    },
    input: {
        flex: 1,
        fontSize: 13,
        marginHorizontal: 8,
    },
    resultCard: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
        borderRadius: 20,

    },
    header: {
        fontSize: 14,
        fontWeight: "700",

    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        marginTop: 10,
    },
    muted: {
        fontSize: 12,
        marginVertical: 4,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    itemText: {
        fontSize: 12,
        marginLeft: 8,
        flex: 1,
    },
});
