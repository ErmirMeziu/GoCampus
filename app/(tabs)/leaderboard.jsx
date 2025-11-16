import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "../../context/ThemeProvider";
import { db, auth } from "../../firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(arr);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const top3 = users.slice(0, 3);
  const others = users.slice(3, 500); 

  const currentUid = auth.currentUser?.uid;
  const myIndex = users.findIndex((u) => u.id === currentUid);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;
  const myUser = myIndex >= 0 ? users[myIndex] : null;

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

          {top3[0] && (
            <View style={[styles.userContainer, { top: 30, left: width * 0.44 }]}>
              <Image
                source={{ uri: top3[0].photoURL || "https://i.pravatar.cc/300" }}
                style={[styles.avatar, { borderColor: theme.gold }]}
              />
              <View
                style={[styles.badgeContainer, { backgroundColor: theme.gold }]}
              >
                <Text style={styles.badgeText}>1</Text>
              </View>
              <Text style={[styles.name, { color: theme.textPrimary }]}>
                {top3[0].name}
              </Text>
              <Text style={[styles.points, { color: theme.textMuted }]}>
                🏆 {top3[0].points}
              </Text>
            </View>
          )}

          {top3[1] && (
            <View style={[styles.userContainer, { top: 86, left: width * 0.15 }]}>
              <Image
                source={{ uri: top3[1].photoURL || "https://i.pravatar.cc/300" }}
                style={[styles.avatar, { borderColor: theme.silver }]}
              />
              <View
                style={[styles.badgeContainer, { backgroundColor: theme.silver }]}
              >
                <Text style={styles.badgeText}>2</Text>
              </View>
              <Text style={[styles.name, { color: theme.textPrimary }]}>
                {top3[1].name}
              </Text>
              <Text style={[styles.points, { color: theme.textMuted }]}>
                {top3[1].points}
              </Text>
            </View>
          )}

          {top3[2] && (
            <View style={[styles.userContainer, { top: 119, right: width * 0.1 }]}>
              <Image
                source={{ uri: top3[2].photoURL || "https://i.pravatar.cc/300" }}
                style={[styles.avatar, { borderColor: theme.bronze }]}
              />
              <View
                style={[styles.badgeContainer, { backgroundColor: theme.bronze }]}
              >
                <Text style={styles.badgeText}>3</Text>
              </View>
              <Text style={[styles.name, { color: theme.textPrimary }]}>
                {top3[2].name}
              </Text>
              <Text style={[styles.points, { color: theme.textMuted }]}>
                {top3[2].points}
              </Text>
            </View>
          )}
        </View>

        {myUser && (
          <View
            style={{
              backgroundColor: "transparent",
              width: "88%",
              padding: 14,
              borderRadius: 16,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: theme.textPrimary,
                  fontSize: 18,
                  fontWeight: "700",
                  marginRight: 12,
                }}
              >
                #{myRank}
              </Text>

              <Image
                source={{
                  uri: myUser.photoURL || "https://i.pravatar.cc/300",
                }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  marginRight: 10,
                }}
              />

              <View>
                <Text
                  style={{
                    color: theme.textPrimary,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {myUser.name || "You"}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                  {myUser.points || 0} pts
                </Text>
              </View>
            </View>
          </View>
        )}

        <GlassView
          style={[
            styles.glassCard,
            {
              backgroundColor: theme.card,
              height: 270, 
            },
          ]}
          intensity={70}
          blurAmount={20}
          tint="systemUltraThinMaterialLight"
        >
          <FlatList
            data={others}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.cardRow,
                  { borderBottomColor: theme.border },
                  index === others.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.rowLeft}>
                  <Text style={[styles.rankNumber, { color: theme.textMuted }]}>
                    {index + 4}
                  </Text>

                  <Image
                    source={{
                      uri: item.photoURL || "https://i.pravatar.cc/300",
                    }}
                    style={styles.listAvatar}
                  />

                  <Text
                    style={[styles.listName, { color: theme.textPrimary }]}
                  >
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
                  <Text
                    style={[styles.listPoints, { color: theme.textPrimary }]}
                  >
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
  headerText: {
    alignSelf: "flex-start",
    left: 20,
    position: "absolute",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 60,
  },
  podiumContainer: {
    width: "100%",
    height: 370,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 55,
  },
  podiumImage: { height: 680, position: "relative", top: 175 },
  userContainer: { position: "absolute", alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3 },
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
  badgeText: { fontSize: 11, color: "#000", fontWeight: "800" },
  name: { fontSize: 13, marginTop: 6 },
  points: { fontSize: 12 },
  glassCard: {
    width: "90%",
    height: 270, 
    borderRadius: 36,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rankNumber: {
    fontWeight: "700",
    fontSize: 15,
    width: 24,
    textAlign: "center",
    marginRight: 8,
  },
  listAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },
  listName: { fontSize: 15 },
  pointsContainer: { flexDirection: "row", alignItems: "center" },
  pointsIcon: { width: 17, height: 17, marginRight: 6 },
  listPoints: { fontWeight: "600", fontSize: 15 },
});
