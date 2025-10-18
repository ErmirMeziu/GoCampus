import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { GlassView } from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeProvider";

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
    { icon: "moon-outline", title: "Dark Mode", subtitle: "Toggle dark theme", type: "toggle", key: "darkMode" },
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

  const handleSave = () => {
    if (editValue.trim()) {
      setUserData((prev) => ({
        ...prev,
        [currentSetting.key]: editValue,
      }));
      setModalVisible(false);
      Alert.alert("Success", `${currentSetting.title} updated successfully!`);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => router.replace("/login") },
    ]);
  };

  const getInputPlaceholder = (type) => {
    switch (type) {
      case "email": return "Enter your email";
      case "phone": return "Enter your phone number";
      case "password": return "Enter new password";
      case "date": return "YYYY-MM-DD";
      default: return `Enter your ${currentSetting?.key}`;
    }
  };

  const getKeyboardType = (type) => {
    switch (type) {
      case "email": return "email-address";
      case "phone": return "phone-pad";
      case "number": return "numeric";
      default: return "default";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Profile Settings</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
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


        <GlassView style={styles.glassCard} intensity={80} blurAmount={25}>
          {settings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.listItem, { borderColor: theme.border }, index === settings.length - 1 && styles.lastItem]}
              onPress={() => handleSettingPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
                  <Ionicons name={item.icon} size={20} color={theme.textPrimary} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.primaryText, { color: theme.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.secondaryText, { color: theme.textMuted }]}>{item.subtitle}</Text>
                </View>
              </View>
              {item.type === "toggle" ? (
                <Switch
                  value={userData[item.key]}
                  onValueChange={() => handleSettingPress(item)}
                  trackColor={{ false: "#767577", true: theme.success }}
                  thumbColor={userData[item.key] ? "#fff" : "#f4f3f4"}
                />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </GlassView>


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


      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalOverlay}>
          <GlassView style={styles.modalContent} intensity={90}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{currentSetting?.title}</Text>
            <TextInput
              style={[styles.textInput, { color: theme.textPrimary, borderColor: theme.border }]}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={getInputPlaceholder(currentSetting?.type)}
              placeholderTextColor={theme.textMuted}
              keyboardType={getKeyboardType(currentSetting?.type)}
              secureTextEntry={currentSetting?.type === "password"}
              autoCapitalize="none"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.secondaryButton, { backgroundColor: theme.card }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 80 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", letterSpacing: 0.5 },
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
  glassCard: { marginHorizontal: 20, borderRadius: 20, padding: 8, marginBottom: 20 },
  listItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 0.5 },
  lastItem: { borderBottomWidth: 0 },
  listItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  textContainer: { flex: 1 },
  primaryText: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  secondaryText: { fontSize: 12 },
  buttonText: { fontSize: 16, fontWeight: "600" },
  actionSection: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20 },
  actionButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, flex: 1, marginHorizontal: 6, justifyContent: "center" },
  bottomSpacing: { height: 40 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.32)", padding: 20 },
  modalContent: { width: "100%", borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  textInput: { borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24, borderWidth: 1 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginHorizontal: 6 },
  primaryButton: {},
  secondaryButton: {},
});
