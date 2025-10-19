import { Alert } from "react-native";

export const handleSaveProfile = ({ editValue, currentSetting, setUserData, setModalVisible }) => {
    if (editValue.trim()) {
        setUserData((prev) => ({
            ...prev,
            [currentSetting.key]: editValue,
        }));
        setModalVisible(false);
        Alert.alert("Success", `${currentSetting.title} updated successfully!`);
    }
};

export const handleLogout = (router) => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => router.replace("/login") },
    ]);
};
