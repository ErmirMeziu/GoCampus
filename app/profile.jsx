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

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    name: "Micheal Jonathon",
    email: "micheal@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-05-15",
    language: "English",
    notifications: true,
    darkMode: true
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [editValue, setEditValue] = useState("");

  const router = useRouter();

  const settings = [
    {
      icon: "person-outline",
      title: "Change Name",
      subtitle: userData.name,
      type: "text",
      key: "name"
    },
    {
      icon: "lock-closed-outline",
      title: "Change Password",
      subtitle: "Update your security",
      type: "password",
      key: "password"
    },
    {
      icon: "mail-outline",
      title: "Change Email",
      subtitle: userData.email,
      type: "email",
      key: "email"
    },
    {
      icon: "call-outline",
      title: "Change Mobile Number",
      subtitle: userData.phone,
      type: "phone",
      key: "phone"
    },
    {
      icon: "calendar-outline",
      title: "Change Date Of Birth",
      subtitle: userData.dob,
      type: "date",
      key: "dob"
    },
    {
      icon: "language-outline",
      title: "Change Language",
      subtitle: userData.language,
      type: "picker",
      key: "language"
    },
    {
      icon: "notifications-outline",
      title: "Notifications",
      subtitle: "Manage your notifications",
      type: "toggle",
      key: "notifications"
    },
    {
      icon: "moon-outline",
      title: "Dark Mode",
      subtitle: "Toggle dark theme",
      type: "toggle",
      key: "darkMode"
    },
  ];

  const handleSettingPress = (setting) => {
    if (setting.type === "toggle") {
      setUserData(prev => ({
        ...prev,
        [setting.key]: !prev[setting.key]
      }));
    } else {
      setCurrentSetting(setting);
      setEditValue(userData[setting.key] || "");
      setModalVisible(true);
    }
  };

  const handleSave = () => {
    if (editValue.trim()) {
      setUserData(prev => ({
        ...prev,
        [currentSetting.key]: editValue
      }));
      setModalVisible(false);
      Alert.alert("Success", `${currentSetting.title} updated successfully!`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => router.replace("/login") }
      ]
    );
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
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </View>


      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Position</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>146</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>


        <GlassView
          style={styles.glassCard}
          intensity={80}
          blurAmount={25}
          tint="systemUltraThinMaterialDark"
        >
          {settings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.listItem,
                index === settings.length - 1 && styles.lastItem
              ]}
              onPress={() => handleSettingPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={20} color="#fff" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.primaryText}>{item.title}</Text>
                  <Text style={styles.secondaryText}>{item.subtitle}</Text>
                </View>
              </View>

              {item.type === "toggle" ? (
                <Switch
                  value={userData[item.key]}
                  onValueChange={() => handleSettingPress(item)}
                  trackColor={{ false: "#767577", true: "#4CAF50" }}
                  thumbColor={userData[item.key] ? "#fff" : "#f4f3f4"}
                />
              ) : (
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
              )}
            </TouchableOpacity>
          ))}
        </GlassView>


        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Export Data</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.bottomSpacing} />
      </ScrollView>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <GlassView style={styles.modalContent} intensity={90} tint="systemUltraThinMaterialDark">
            <Text style={styles.modalTitle}>{currentSetting?.title}</Text>

            <TextInput
              style={styles.textInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={getInputPlaceholder(currentSetting?.type)}
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType={getKeyboardType(currentSetting?.type)}
              secureTextEntry={currentSetting?.type === "password"}
              autoCapitalize="none"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleSave}
              >
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

  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },


  iconButton: {
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: "center",
  },


  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  profileName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 20,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 10,
  },

  glassCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 20,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  secondaryText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },


  actionSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
  },
  bottomSpacing: {
    height: 40,
  },


  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    backgroundColor: "rgba(30,30,30,0.9)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});