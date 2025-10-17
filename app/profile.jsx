import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";




export default function ProfileScreen({ navigation }) {
  const settings = [
    { icon: "person-outline", title: "Change Name", subtitle: "You can change name and surname" },
    { icon: "lock-closed-outline", title: "Change Password", subtitle: "Change your password easily" },
    { icon: "mail-outline", title: "Change Email", subtitle: "You can change your email" },
    { icon: "call-outline", title: "Change Mobile Number", subtitle: "Change your mobile number" },
    { icon: "calendar-outline", title: "Change Date Of Birth", subtitle: "Change your date of birth" },
    { icon: "language-outline", title: "Change Language", subtitle: "Change your language here" },
  ];
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Micheal Jonathon</Text>
        </View>

        <GlassView
          style={styles.glassCard}
          intensity={70}
          blurAmount={20}
          tint="systemUltraThinMaterialLight"
        >
          {settings.map((item, index) => (
            <TouchableOpacity key={index} style={styles.option}>
              <Ionicons name={item.icon} size={22} color="#fff" style={styles.optionIcon} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </GlassView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    paddingTop: 60,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  glassCard: {
    width: "90%",
    borderRadius: 25,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  optionSubtitle: {
    color: "#aaa",
    fontSize: 13,
  },
});
