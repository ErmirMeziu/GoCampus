import { Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

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

        {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
                try {
                    await signOut(auth);
                    router.replace("/login");
                } catch (error) {
                    console.log("Logout error:", error);
                }
            }
        }
    ]);
};
