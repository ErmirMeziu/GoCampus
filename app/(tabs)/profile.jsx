import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeProvider";
import { auth } from "../../firebase/config";
import SettingsList from "../../components/SettingsList";
import EditSettingModal from "../../components/EditSettingModal";
import EmailLogin from "../../components/EmailLogin";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { router } from "expo-router";
import { Alert } from 'react-native';
import { listenUserProfile, updateUserProfile } from "../../firebase/profile";
import {
  GithubAuthProvider,
  linkWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { handleLogout } from "../../components/ProfileActions";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const user = auth.currentUser;

 const pickImg = async () => {
  try {
    // Request permission to access the camera and media library
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== "granted" || galleryPermission.status !== "granted") {
      alert("Sorry, we need camera and gallery permissions to make this work!");
      return;
    }

    // Ask the user if they want to take a photo or pick from the gallery
    const result = await new Promise((resolve) =>
      Alert.alert(
        "Select Image",
        "Choose an option",
        [
          {
            text: "Take a Photo",
            onPress: async () => {
              const picked = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1], // Optional, set the aspect ratio of the image
                quality: 1, // Quality of the image
                base64: true, // Return the image in base64
              });
              resolve(picked);
            },
          },
          {
            text: "Pick from Gallery",
            onPress: async () => {
              const picked = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1], // Optional, set the aspect ratio of the image
                quality: 1, // Quality of the image
                base64: true, // Return the image in base64
              });
              resolve(picked);
            },
          },
          { text: "Cancel", onPress: () => resolve(null), style: "cancel" },
        ],
        { cancelable: true }
      )
    );

    if (!result || result.cancelled) return;

    // If a photo is taken or picked from the gallery, upload it
    const photoBase64 = result.assets[0].base64;

    // Upload the photo to Firebase
    await updateUserProfile(user.uid, {
      photoURL: `data:image/jpeg;base64,${photoBase64}`, // Save the base64 string
    });

  } catch (e) {
    alert(e.message); // Handle any errors that occur
  }
};


  useEffect(() => {
    if (!user) return;

    return listenUserProfile(user.uid, (profile) => {
      const providers = user.providerData;

      const emailProvider = providers.find((p) => p.providerId === "password");
      const githubProvider = providers.find((p) => p.providerId === "github.com");

      setUserData({
        ...profile, 

        emailPasswordLinked: !!emailProvider,
        githubLinked: !!githubProvider,
        emailPasswordEmail: emailProvider?.email || null,
        githubEmail: githubProvider?.email || null,

        mainEmail: user.email,
      });
    });
  }, []);

  if (!userData)
    return (
      <View style={s.center}>
        <Text style={{ color: theme.textPrimary }}>Loading...</Text>
      </View>
    );

  const changePass = async (oldP, newP, setError) => {
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, oldP);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newP);
      await signOut(auth);
      setShowPasswordModal(false);
      router.replace("/login");
    } catch (err) {
      if (err.message.includes("wrong-password")) setError("Incorrect current password.");
      else if (err.message.includes("weak-password")) setError("Weak password.");
      else setError(err.message);
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
      <View style={s.logoutWrap}>
        <TouchableOpacity onPress={() => handleLogout(router)} style={s.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={{ alignItems: "center", paddingVertical: 35 }}>
          <TouchableOpacity onPress={pickImg}>
            <Image
              source={{ uri: userData.photoURL || "https://i.pravatar.cc/300" }}
              style={{ width: 120, height: 120, borderRadius: 70, borderWidth: 2, borderColor: theme.primary }}
            />
            <View style={[s.cameraBadge,{backgroundColor:theme.primary}]}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "700", marginTop: 12 }}>
            {userData.name}
          </Text>

          <View style={s.card}>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 4 }}>Connected Emails</Text>

            {userData.emailPasswordEmail && (
              <View style={s.emailRow}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.textPrimary} />
                <Text style={[s.emailText,{color:theme.textPrimary}]}>{userData.emailPasswordEmail}</Text>
                <View style={[s.badge, { backgroundColor: "#4CAF50" }]}>
                  <Text style={s.badgeText}>EMAIL</Text>
                </View>
              </View>
            )}

            {userData.githubLinked && userData.githubEmail && (
              <View style={s.emailRow}>
                <Ionicons name="logo-github" size={18} color={theme.textPrimary} />
                <Text style={[s.emailText,{color:theme.textPrimary}]}>{userData.githubEmail}</Text>
                <View style={[s.badge, { backgroundColor: "#333" }]}>
                  <Text style={s.badgeText}>GITHUB</Text>
                </View>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
        
            <TouchableOpacity
              style={[s.methodBtn, { backgroundColor: userData.emailPasswordLinked ? "rgba(76,175,80,0.50)" : "rgba(255,255,255,0.08)" }]}
              onPress={() => !userData.emailPasswordLinked && setShowEmailLogin(true)}
            >
              <Ionicons name="mail-outline" size={18} color={userData.emailPasswordLinked ? "lime" : theme.textPrimary} />
              <Text style={s.methodText}>{userData.emailPasswordLinked ? "Email Connected" : "Add Email"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={Platform.OS === "ios"}
              style={[
                s.methodBtn,
                {
                  backgroundColor:
                    Platform.OS === "ios"
                      ? "rgba(120,120,120,0.8)"
                      : userData.githubLinked
                        ? "rgba(51,51,51,0.5)"
                        : "rgba(255,255,255,0.08)",
                  opacity: Platform.OS === "ios" ? 0.4 : 1,
                },
              ]}
              onPress={async () => {
                if (Platform.OS === "ios" || userData.githubLinked) return;

                try {
                  const provider = new GithubAuthProvider();
                  await linkWithPopup(auth.currentUser, provider);

                  const providers = auth.currentUser.providerData;
                  const githubProvider = providers.find((p) => p.providerId === "github.com");

                  setUserData((prev) => ({
                    ...prev,
                    githubLinked: true,
                    githubEmail: githubProvider?.email,
                  }));
                } catch (e) {
                  alert(e.message);
                }
              }}
            >
              <Ionicons
                name="logo-github"
                size={18}
                color={Platform.OS === "ios" ? "#888" : userData.githubLinked ? "#fff" : theme.textPrimary}
              />

              <Text style={s.methodText}>
                {Platform.OS === "ios"
                  ? "Unavailable on iOS"
                  : userData.githubLinked
                    ? "GitHub Connected"
                    : "Add GitHub"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <SettingsList
          settings={settings}
          theme={theme}
          onPress={(setting) => {
            if (setting.type === "passwordModal") return setShowPasswordModal(true);
            if (setting.type === "toggle") return updateUserProfile(user.uid, { [setting.key]: !userData[setting.key] });

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
        <View style={s.overlay}>
          <EmailLogin uid={user.uid} onClose={() => setShowEmailLogin(false)} />
        </View>
      )}

      <ChangePasswordModal visible={showPasswordModal} theme={theme} onClose={() => setShowPasswordModal(false)} onChangePassword={changePass} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoutWrap: { position: "absolute", top: 0, right: 0, paddingTop: 45, paddingRight: 18, zIndex: 999 },
  logoutBtn: { padding: 8, borderRadius: 20 },
  scroll: { paddingTop: 100, marginTop: -40, paddingBottom: 40 },
  cameraBadge: { position: "absolute", bottom: 0, right: 0, padding: 6, borderRadius: 30, },
  card: { backgroundColor: "rgba(255,255,255,0.08)", marginTop: 16, padding: 15, borderRadius: 15, width: "90%", gap: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  methodBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  methodText: { marginLeft: 8, color: "white", fontSize: 14, fontWeight: "500" },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  emailText: { color: "white", fontSize: 14, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: "white", fontSize: 10, fontWeight: "700" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
});
