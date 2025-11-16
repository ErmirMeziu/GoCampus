import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeProvider";
import { auth } from "../../firebase/config";

import SettingsList from "../../components/SettingsList";
import EditSettingModal from "../../components/EditSettingModal";
import EmailLogin from "../../components/EmailLogin";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { router } from "expo-router";


import { listenUserProfile, updateUserProfile } from "../../firebase/profile";

import {
  GithubAuthProvider,
  linkWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
} from "firebase/auth";

export default function ProfileScreen() {
  const { theme } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [userData, setUserData] = useState(null);

  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    return listenUserProfile(user.uid, (profile) => {
      const providers = auth.currentUser.providerData;

      const emailProvider = providers.find((p) => p.providerId === "password");
      const githubProvider = providers.find((p) => p.providerId === "github.com");

      const merged = {
        name: "",
        phone: "",
        dob: "",
        language: "English",
        notifications: true,

        emailPasswordLinked: !!emailProvider,
        githubLinked: !!githubProvider,

        emailPasswordEmail: emailProvider?.email || null,
        githubEmail: githubProvider?.email || null,

        mainEmail: user.email,
        photoURL: null,

        ...profile,
      };

      setUserData(merged);

      if (profile.githubLinked !== merged.githubLinked)
        updateUserProfile(user.uid, { githubLinked: merged.githubLinked });

      if (profile.emailPasswordLinked !== merged.emailPasswordLinked)
        updateUserProfile(user.uid, { emailPasswordLinked: merged.emailPasswordLinked });
    });
  }, []);

  if (!userData)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.textPrimary }}>Loading...</Text>
      </View>
    );

  const handlePasswordChange = async (currentPass, newPass, setError) => {
    try {
      const currentUser = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPass
      );

      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPass);

      await signOut(auth);

      setShowPasswordModal(false);

      alert("Password updated! Please log in again.");

      router.replace("/login");

    } catch (err) {
      if (err.message.includes("auth/wrong-password")) {
        setError("Current password is incorrect.");
      } else if (err.message.includes("auth/weak-password")) {
        setError("New password is too weak.");
      } else {
        setError(err.message);
      }
    }
  };


  const settings = [
    { icon: "person-outline", title: "Name", subtitle: userData.name, type: "text", key: "name" },
    { icon: "lock-closed-outline", title: "Password", subtitle: "Change password", type: "passwordModal" },
    { icon: "call-outline", title: "Phone", subtitle: userData.phone || "Not set", type: "phone", key: "phone" },
    { icon: "calendar-outline", title: "DOB", subtitle: userData.dob || "Not set", type: "date", key: "dob" },
    { icon: "language-outline", title: "Language", subtitle: userData.language, type: "picker", key: "language" },
    { icon: "notifications-outline", title: "Notifications", subtitle: userData.notifications ? "Enabled" : "Disabled", type: "toggle", key: "notifications" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView>
        {/* HEADER */}
        <View style={{ alignItems: "center", paddingVertical: 35 }}>
          <Image
            source={{ uri: userData.photoURL || "https://i.pravatar.cc/300" }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 70,
              borderWidth: 2,
              borderColor: theme.primary,
            }}
          />

          <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "700", marginTop: 12 }}>
            {userData.name}
          </Text>

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              marginTop: 16,
              padding: 15,
              borderRadius: 15,
              width: "90%",
              gap: 8,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 4 }}>
              Connected Emails
            </Text>

            {userData.emailPasswordEmail && (
              <View style={styles.emailRow}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.textPrimary} />
                <Text style={styles.emailText}>{userData.emailPasswordEmail}</Text>
                <View style={[styles.badge, { backgroundColor: "#4CAF50" }]}>
                  <Text style={styles.badgeText}>EMAIL</Text>
                </View>
              </View>
            )}

            {userData.githubEmail && (
              <View style={styles.emailRow}>
                <Ionicons name="logo-github" size={18} color={theme.textPrimary} />
                <Text style={styles.emailText}>{userData.githubEmail}</Text>
                <View style={[styles.badge, { backgroundColor: "#333" }]}>
                  <Text style={styles.badgeText}>GITHUB</Text>
                </View>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>

            <TouchableOpacity
              style={[
                styles.methodBtn,
                {
                  backgroundColor: userData.emailPasswordLinked
                    ? "rgba(76,175,80,0.25)"
                    : "rgba(255,255,255,0.08)",
                },
              ]}
              onPress={() => {
                if (!userData.emailPasswordLinked) setShowEmailLogin(true);
              }}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={userData.emailPasswordLinked ? "lime" : theme.textPrimary}
              />
              <Text style={styles.methodText}>
                {userData.emailPasswordLinked ? "Email Connected" : "Add Email"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodBtn,
                {
                  backgroundColor: userData.githubLinked
                    ? "rgba(51,51,51,0.5)"
                    : "rgba(255,255,255,0.08)",
                },
              ]}
              onPress={async () => {
                if (userData.githubLinked) return;
                try {
                  const provider = new GithubAuthProvider();
                  await linkWithPopup(auth.currentUser, provider);
                } catch (e) {
                  alert(e.message);
                }
              }}
            >
              <Ionicons
                name="logo-github"
                size={18}
                color={userData.githubLinked ? "#fff" : theme.textPrimary}
              />
              <Text style={styles.methodText}>
                {userData.githubLinked ? "GitHub Connected" : "Add GitHub"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <SettingsList
          settings={settings}
          theme={theme}
          onPress={(setting) => {
            if (setting.type === "passwordModal") {
              setShowPasswordModal(true);
              return;
            }

            if (setting.type === "toggle") {
              updateUserProfile(user.uid, { [setting.key]: !userData[setting.key] });
              return;
            }

            setCurrentSetting(setting);
            setEditValue(userData[setting.key] || "");
            setModalVisible(true);
          }}
        />

        <EditSettingModal
          visible={modalVisible}
          theme={theme}
          currentSetting={currentSetting}
          editValue={editValue}
          setEditValue={setEditValue}
          onClose={() => setModalVisible(false)}
          onSave={() => {
            updateUserProfile(user.uid, { [currentSetting.key]: editValue });
            setModalVisible(false);
          }}
        />
      </ScrollView>

      {showEmailLogin && (
        <View style={styles.overlay}>
          <EmailLogin uid={user.uid} onClose={() => setShowEmailLogin(false)} />
        </View>
      )}

      <ChangePasswordModal
        visible={showPasswordModal}
        theme={theme}
        onClose={() => setShowPasswordModal(false)}
        onChangePassword={handlePasswordChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  methodBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  methodText: {
    marginLeft: 8,
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  emailText: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
