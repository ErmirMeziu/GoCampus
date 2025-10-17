import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";


const { width, height } = Dimensions.get("window");

const topUsers = [
  { id: "2", name: "joamartini", points: 105, image: "https://randomuser.me/api/portraits/men/31.jpg" },
  { id: "1", name: "alex", points: 146, image: "https://randomuser.me/api/portraits/women/40.jpg" },
  { id: "3", name: "ranking", points: 99, image: "https://randomuser.me/api/portraits/men/70.jpg" },
];

const otherUsers = [
  { id: "4", name: "kristian", points: 96, image: "https://randomuser.me/api/portraits/women/47.jpg" },
  { id: "5", name: "mehmed", points: 88, image: "https://randomuser.me/api/portraits/men/50.jpg" },
  { id: "6", name: "sebastian", points: 87, image: "https://randomuser.me/api/portraits/men/46.jpg" },
  { id: "7", name: "valza", points: 85, image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "8", name: "vlera", points: 80, image: "https://randomuser.me/api/portraits/women/61.jpg" },
  { id: "9", name: "toni", points: 79, image: "https://randomuser.me/api/portraits/men/25.jpg" },
];

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0b0e" }}>
      <LinearGradient
        colors={["#6b5e55", "#3d3430", "#1b1819", "#0b0b0e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.headerText}>Leaderboard</Text>

        {/* Podium */}
        <View style={styles.podiumContainer}>
          <Image
            source={require("../assets/img/podiumRank.png")}
            style={styles.podiumImage}
            resizeMode="contain"
          />

          {/* 1st */}
          <View style={[styles.userContainer, { top: 30, left: width * 0.44 }]}>
            <View style={styles.avatarShadow}>
              <Image
                source={{ uri: topUsers[1].image }}
                style={[styles.avatar, { borderColor: "#FFD700" }]}
              />
            </View>
            <View style={[styles.badgeContainer, { backgroundColor: "#FFD700" }]}>
              <Text style={styles.badgeText}>1</Text>
            </View>
            <Text style={styles.name}>{topUsers[1].name}</Text>
            <Text style={styles.points}>🏆 {topUsers[1].points}</Text>
          </View>

          {/* 2nd */}
          <View style={[styles.userContainer, { top: 86, left: width * 0.15 }]}>
            <View style={styles.avatarShadow}>
              <Image
                source={{ uri: topUsers[0].image }}
                style={[styles.avatar, { borderColor: "#C0C0C0" }]}
              />
            </View>
            <View style={[styles.badgeContainer, { backgroundColor: "#C0C0C0" }]}>
              <Text style={styles.badgeText}>2</Text>
            </View>
            <Text style={styles.name}>{topUsers[0].name}</Text>
            <Text style={styles.points}>{topUsers[0].points}</Text>
          </View>

          {/* 3rd */}
          <View style={[styles.userContainer, { top: 119, right: width * 0.10 }]}>
            <View style={styles.avatarShadow}>
              <Image
                source={{ uri: topUsers[2].image }}
                style={[styles.avatar, { borderColor: "#CD7F32" }]}
              />
            </View>
            <View style={[styles.badgeContainer, { backgroundColor: "#CD7F32" }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
            <Text style={styles.name}>{topUsers[2].name}</Text>
            <Text style={styles.points}>{topUsers[2].points}</Text>
          </View>
        </View>

        {/* Lower leaderboard (fills bottom section) */}
        <View style={styles.cardWrapper}>
          <BlurView intensity={40} tint="dark" style={styles.cardContainer}>
            <FlatList
              data={otherUsers}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.cardRow,
                    index === otherUsers.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rankNumber}>{index + 4}</Text>
                    <Image source={{ uri: item.image }} style={styles.listAvatar} />
                    <Text style={styles.listName}>{item.name}</Text>
                  </View>

                  <View style={styles.pointsContainer}>
                    <Image
                      source={{ uri: "https://cdn-icons-png.flaticon.com/512/2107/2107957.png" }}
                      style={styles.pointsIcon}
                    />
                    <Text style={styles.listPoints}>{item.points}</Text>
                  </View>
                </View>
              )}
            />
          </BlurView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    color: "white",
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  podiumContainer: {
    width: "100%",
    height: height * 0.42,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  podiumImage: {
    height: 680,
    position: "relative",
    top: 175,
    shadowColor: "#5a5858ff",
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  userContainer: {
    position: "absolute",
    alignItems: "center",
  },
  avatarShadow: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
  },
  badgeContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 11,
    color: "#000",
    fontWeight: "800",
  },
  name: {
    color: "white",
    fontSize: 13,
    marginTop: 6,
  },
  points: {
    color: "#d1cfcf",
    fontSize: 12,
  },

 cardWrapper: {
  flex: 1,
  width: width,
  alignSelf: "center",
  borderRadius: 22,
  marginBottom: 20,
  overflow: "hidden",

  shadowColor: "#5a5858ff",
  shadowOpacity: 0.75,
  shadowOffset: { width: 0, height: 14 },
  shadowRadius: 32,
  elevation: 22,
},
  cardContainer: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
    paddingVertical: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankNumber: {
    color: "#aaa",
    fontWeight: "700",
    fontSize: 15,
    width: 24,
    textAlign: "center",
    marginRight: 8,
  },
  listAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  listName: {
    color: "white",
    fontSize: 14,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#1631c8ff",
  },
  listPoints: {
    color: "#cfcfcf",
    fontWeight: "600",
    fontSize: 14,
  },
});
