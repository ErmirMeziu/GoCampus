import { Tabs } from "expo-router";
import { ThemeProvider } from "../context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "../context/ThemeProvider";

function TabBar({ props }) {
    const { theme } = useTheme();

    return (
        <GlassView
            glassEffectStyle="clear"
            style={{
                position: "absolute",
                bottom: 20,
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
                const iconColor = isFocused ? theme.iconColorFocused : theme.iconColor;
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
                                backgroundColor: isFocused ? "rgba(255,255,255,0.2)" : "transparent",
                            }}
                        >
                            {options.tabBarIcon({ color: iconColor, size: iconSize })}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </GlassView>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
                tabBar={(props) => <TabBar props={props} />}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="groups"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="people-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="resources"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="book-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="leaderboard"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="trophy-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </ThemeProvider>
    );
}
