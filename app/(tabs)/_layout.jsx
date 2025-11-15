
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeProvider";

function CustomTabBar(props) {
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
                borderRadius: 38,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
            }}
        >
            {props.state.routes.map((route, index) => {
                const isFocused = props.state.index === index;

                const { options } = props.descriptors[route.key];
                const IconComponent = options.tabBarIcon;

                const iconProps = {
                    color: isFocused ? theme.iconColorFocused : theme.iconColor,
                    size: isFocused ? 28 : 24,
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => props.navigation.navigate(route.name)}
                        activeOpacity={0.8}
                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {IconComponent && IconComponent(iconProps)}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </GlassView>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="groups"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="resources"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="book-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="leaderboard"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="trophy-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="notes-ai"
                options={{
                    title: "AI Notes",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="sparkles" size={20} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
