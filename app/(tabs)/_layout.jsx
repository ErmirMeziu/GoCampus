import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function Layout() {
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    useEffect(() => {
        getStatusBarHeight((height) => {
            setStatusBarHeight(height);
        });
    }, []);
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { display: "none" }
            }}
            tabBar={(props) => (
                <GlassView
                    glassEffectStyle="clear"
                    style={{
                        position: "absolute",
                        bottom: -10,
                        left: 20,
                        right: 20,
                        height: 60,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        borderRadius: 38,
                        paddingHorizontal: 10,
                    }}
                >
                    {props.state.routes.map((route, index) => {
                        const isFocused = props.state.index === index;
                        const { options } = props.descriptors[route.key];
                        const iconColor = isFocused ? "#fff" : "#ccc";
                        const iconSize = isFocused ? 28 : 24;

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={() => props.navigation.navigate(route.name)}
                                style={{ alignItems: "center", justifyContent: "center" }}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: isFocused ? "rgba(255,255,255,0.2)" : "transparent", // Efekt i lehtë fokus
                                    }}
                                >
                                    {options.tabBarIcon({ color: iconColor, size: iconSize })}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </GlassView>
            )}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="resources"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}