import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "../../context/ThemeProvider";

const { width, height } = Dimensions.get("window");

const topUsers = [
  { id: "2", name: "eron", points: 105, image: "https://randomuser.me/api/portraits/men/31.jpg" },
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
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={theme.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.headerText, { color: theme.textPrimary }]}>
          Leaderboard
        </Text>

        <View style={styles.podiumContainer}>
          <Image
            source={require("../../assets/img/podiumRank.png")}
            style={styles.podiumImage}
            resizeMode="contain"
          />

          <View style={[styles.userContainer, { top: 30, left: width * 0.44 }]}>
            <Image
              source={{ uri: topUsers[1].image }}
              style={[styles.avatar, { borderColor: theme.gold }]}
            />
            <View style={[styles.badgeContainer, { backgroundColor: theme.gold }]}>
              <Text style={styles.badgeText}>1</Text>
            </View>
            <Text style={[styles.name, { color: theme.textPrimary }]}>
              {topUsers[1].name}
            </Text>
            <Text style={[styles.points, { color: theme.textMuted }]}>
              🏆 {topUsers[1].points}
            </Text>
          </View>

          <View style={[styles.userContainer, { top: 86, left: width * 0.15 }]}>
            <Image
              source={{ uri: topUsers[0].image }}
              style={[styles.avatar, { borderColor: theme.silver }]}
            />
            <View style={[styles.badgeContainer, { backgroundColor: theme.silver }]}>
              <Text style={styles.badgeText}>2</Text>
            </View>
            <Text style={[styles.name, { color: theme.textPrimary }]}>
              {topUsers[0].name}
            </Text>
            <Text style={[styles.points, { color: theme.textMuted }]}>
              {topUsers[0].points}
            </Text>
          </View>

          <View style={[styles.userContainer, { top: 119, right: width * 0.1 }]}>
            <Image
              source={{ uri: topUsers[2].image }}
              style={[styles.avatar, { borderColor: theme.bronze }]}
            />
            <View style={[styles.badgeContainer, { backgroundColor: theme.bronze }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
            <Text style={[styles.name, { color: theme.textPrimary }]}>
              {topUsers[2].name}
            </Text>
            <Text style={[styles.points, { color: theme.textMuted }]}>
              {topUsers[2].points}
            </Text>
          </View>
        </View>


        <GlassView
          style={[styles.glassCard, { backgroundColor: theme.card }]}
          intensity={70}
          blurAmount={20}
          tint="systemUltraThinMaterialLight"
        >
          <FlatList
            data={otherUsers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.cardRow,
                  { borderBottomColor: theme.border },
                  index === otherUsers.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.rowLeft}>
                  <Text style={[styles.rankNumber, { color: theme.textMuted }]}>
                    {index + 4}
                  </Text>
                  <Image source={{ uri: item.image }} style={styles.listAvatar} />
                  <Text style={[styles.listName, { color: theme.textPrimary }]}>
                    {item.name}
                  </Text>
                </View>

                <View style={styles.pointsContainer}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/2107/2107957.png",
                    }}
                    style={[styles.pointsIcon, { tintColor: theme.gold }]}
                  />
                  <Text style={[styles.listPoints, { color: theme.textPrimary }]}>
                    {item.points}
                  </Text>
                </View>
              </View>
            )}
          />
        </GlassView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, alignItems: "center" },
  headerText: {alignSelf: "flex-start",left: 20,position: "absolute",fontSize: 22, fontWeight: "700",marginTop: 60,marginBottom: 8,},
  podiumContainer: {width: "100%",height: 370,alignItems: "center",justifyContent: "center",position: "relative",marginTop: 55,},
  podiumImage: { height: 680, position: "relative", top: 175 },
  userContainer: { position: "absolute", alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3 },
  badgeContainer: { position: "absolute", top: -8, right: -8, borderRadius: 10,width: 22,height: 22,justifyContent: "center",alignItems: "center", },
  badgeText: { fontSize: 11, color: "#000", fontWeight: "800" },
  name: { fontSize: 13, marginTop: 6 },
  points: { fontSize: 12 },
  cardRow: {flexDirection: "row",alignItems: "center",justifyContent: "space-between",paddingVertical: 15,paddingHorizontal: 18,borderBottomWidth: 1, },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rankNumber: { fontWeight: "700", fontSize: 15, width: 24, textAlign: "center", marginRight: 8 },
  listAvatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },
  listName: { fontSize: 14 },
  pointsContainer: { flexDirection: "row", alignItems: "center" },
  pointsIcon: { width: 16, height: 16, marginRight: 6 },
  listPoints: { fontWeight: "600", fontSize: 14 },
  glassCard: { width: "90%", height: 360, borderRadius: 36, paddingHorizontal: 10, marginBottom: 20 },
});