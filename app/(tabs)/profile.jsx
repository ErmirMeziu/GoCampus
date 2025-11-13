import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeProvider";
import { handleSaveProfile, handleLogout } from "../../components/ProfileActions";
import SettingsList from "../../components/SettingsList";
import EditSettingModal from "../../components/EditSettingModal";
import { GlassView } from "expo-glass-effect";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [userData, setUserData] = useState({
    name: "Micheal Jonathon",
    email: "micheal@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-05-15",
    language: "English",
    notifications: true,
    darkMode: true,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [editValue, setEditValue] = useState("");

  const router = useRouter();

  const settings = [
    { icon: "person-outline", title: "Change Name", subtitle: userData.name, type: "text", key: "name" },
    { icon: "lock-closed-outline", title: "Change Password", subtitle: "Update your security", type: "password", key: "password" },
    { icon: "mail-outline", title: "Change Email", subtitle: userData.email, type: "email", key: "email" },
    { icon: "call-outline", title: "Change Mobile Number", subtitle: userData.phone, type: "phone", key: "phone" },
    { icon: "calendar-outline", title: "Change Date Of Birth", subtitle: userData.dob, type: "date", key: "dob" },
    { icon: "language-outline", title: "Change Language", subtitle: userData.language, type: "picker", key: "language" },
    { icon: "notifications-outline", title: "Notifications", subtitle: "Manage your notifications", type: "toggle", key: "notifications" },
  ];

  const handleSettingPress = (setting) => {
    if (setting.type === "toggle") {
      setUserData((prev) => ({
        ...prev,
        [setting.key]: !prev[setting.key],
      }));
    } else {
      setCurrentSetting(setting);
      setEditValue(userData[setting.key] || "");
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Profile Settings</Text>
        <TouchableOpacity onPress={() => handleLogout(router)} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={22} color={theme.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
   
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: "https://i.pravatar.cc/300" }} style={[styles.profileImage, { borderColor: theme.border }]} />
            <TouchableOpacity style={[styles.editImageButton, { backgroundColor: theme.primary, borderColor: theme.background }]}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>{userData.name}</Text>
          <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{userData.email}</Text>

          <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.textPrimary }]}>1</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Position</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.textPrimary }]}>146</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Rating</Text>
            </View>
          </View>
        </View>

        <SettingsList
          settings={settings}
          userData={userData}
          theme={theme}
          onPress={handleSettingPress}
        />

        <View style={styles.actionSection}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <Ionicons name="share-social-outline" size={20} color={theme.textPrimary} />
            <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <Ionicons name="download-outline" size={20} color={theme.textPrimary} />
            <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Export Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <EditSettingModal
        visible={modalVisible}
        theme={theme}
        currentSetting={currentSetting}
        editValue={editValue}
        setEditValue={setEditValue}
        onClose={() => setModalVisible(false)}
        onSave={() => handleSaveProfile({ editValue, currentSetting, setUserData, setModalVisible })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 80 },
  header: {flexDirection: "row",alignItems: "center",justifyContent: "space-between",paddingHorizontal: 20,paddingVertical: 16,borderBottomWidth: 0.5,},
  headerTitle: { fontSize: 18, fontWeight: "700" },
  iconButton: { padding: 4 },
  profileSection: { alignItems: "center", paddingVertical: 30, paddingHorizontal: 20 },
  imageContainer: { position: "relative", marginBottom: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3 },
  editImageButton: { position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 2 },
  profileName: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  profileEmail: { fontSize: 14, marginBottom: 20 },
  statsContainer: { flexDirection: "row", borderRadius: 20, padding: 16, marginTop: 10 },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, marginHorizontal: 10 },
  actionSection: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20 },
  actionButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, flex: 1, marginHorizontal: 6, justifyContent: "center" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  bottomSpacing: { height: 40 },
});
