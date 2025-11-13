import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeProvider";
import { GlassView } from "expo-glass-effect";

export default function HomeScreen() {
  const screenWidth = Dimensions.get("window").width;
  const { theme, isDarkMode } = useTheme();

  const events = [
    {
      id: "1",
      title: "Hackathon 2025",
      date: "Oct 20",
      location: "Innovation Hall",
      description: "Showcase your coding skills and build creative solutions with your peers.",
      image:
        "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1000&q=80",
      likes: 128,
      comments: 12,
      isHot: true,
    },
    {
      id: "2",
      title: "Study Night",
      date: "Oct 22",
      location: "Library Hall B",
      description: "Collaborative study session with music, snacks, and focus zones.",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80",
      likes: 67,
      comments: 8,
      isHot: false,
    },
    {
      id: "3",
      title: "Campus Cleanup",
      date: "Oct 25",
      location: "Main Garden",
      description: "Join our eco movement to keep the campus clean and green 🌱.",
      image:
        "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?auto=format&fit=crop&w=1000&q=80",
      likes: 89,
      comments: 15,
      isHot: true,
    },
  ];

  const posts = [
    {
      id: "1",
      user: "Anna Lee",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      time: "2h ago",
      text: "📘 Just uploaded new 'Mobile Notes' in Resources! Check them out!",
      likes: 34,
      comments: 5,
      trending: true,
    },
    {
      id: "2",
      user: "Mark Johnson",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      time: "5h ago",
      text: "🤖 Join the 'AI Projects' group for collaborative learning.",
      likes: 21,
      comments: 3,
      trending: false,
    },
    {
      id: "3",
      user: "Sophie Turner",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
      time: "1d ago",
      text: "🧠 Seminar on Brain Computing this Friday! Don’t miss it!",
      likes: 56,
      comments: 12,
      trending: true,
    },
  ];

  const barData = {
    labels: ["AI", "Web", "DB", "Network"],
    datasets: [{ data: [80, 60, 70, 50] }],
  };

  const colors = ["#60A5FA", "#F87171", "#FBBF24", "#A78BFA"];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          isDarkMode
            ? require("../../assets/backgrounds/dark.png")
            : require("../../assets/backgrounds/light.png")
        }
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"

      />

      <View style={styles.header}>
        <View style={styles.profileSection}>
          <GlassView intensity={40} style={styles.avatar}>
            <Ionicons name="person" size={26} color={theme.textPrimary} />
          </GlassView>
          <View>
            <Text style={[styles.profileName, { color: theme.textPrimary }]}>Ermir Meziu</Text>
            <Text style={[styles.profileId, { color: theme.textMuted }]}>ID: 230756100</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color={theme.textPrimary} style={styles.icon} />
          <Ionicons name="search-outline" size={22} color={theme.textPrimary} style={styles.icon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Events</Text>
        <FlatList
          data={events}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} style={{ marginRight: 15 }}>
              <GlassView intensity={50} style={styles.eventCard}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.eventImage}
                  imageStyle={{ borderRadius: 15 }}
                >
                  {item.isHot && (
                    <View style={styles.hotBadge}>
                      <Ionicons name="flame" size={16} color="#fff" />
                      <Text style={styles.hotText}>Hot</Text>
                    </View>
                  )}
                  <View style={styles.eventOverlay}>
                    <Text style={[styles.eventTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                    <Text style={{ color: theme.secondary, fontSize: 12 }}>📅 {item.date}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>📍 {item.location}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 5 }} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </ImageBackground>
              </GlassView>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />


        <Text style={[styles.sectionTitle, { marginTop: 25, color: theme.textPrimary }]}>Campus Insights</Text>
        <GlassView glassEffectStyle="clear" intensity={50} style={styles.insightsContainer}>
          <Text style={[styles.insightsSubtitle, { color: theme.textMuted }]}>
            Discover how active each study group is on campus — join one to boost your learning!
          </Text>


          {barData.labels.map((label, index) => {
            const value = barData.datasets[0].data[index];
            return (
              <View key={index} style={styles.groupRow}>
                <Text style={{ color: theme.textPrimary, width: 50, fontSize: 12 }}>{label}</Text>
                <View style={styles.groupBarBackground}>
                  <View
                    style={[
                      styles.groupBarFill,
                      { width: `${value}%`, backgroundColor: colors[index % colors.length] },
                    ]}
                  />
                </View>
                <Text style={{ color: theme.textPrimary, width: 30, fontSize: 12, textAlign: "right" }}>{value}</Text>
              </View>
            );
          })}


          <Text style={[styles.insightsLabel, { color: theme.textPrimary }]}>Top Performing Groups</Text>
          <View style={styles.topGroupsContainer}>
            {[
              { icon: "flame", name: "AI Club", stat: "12 Projects" },
              { icon: "musical-notes", name: "Music", stat: "8 Events" },
              { icon: "brush", name: "Design Crew", stat: "15 Works" },
            ].map((group, index) => (
              <GlassView
                key={index}
                intensity={40}
                glassEffectStyle="clear"
                style={[styles.groupCard, { borderColor: theme.cardBorder, borderWidth: 1 }]}
              >
                <Ionicons name={group.icon} size={22} color={theme.textPrimary} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{group.name}</Text>
                <Text style={[styles.cardStat, { color: theme.textMuted }]}>{group.stat}</Text>
              </GlassView>
            ))}
          </View>


          <TouchableOpacity style={[styles.joinGroupButton, { backgroundColor: theme.primary }]}>
            <Ionicons name="people" size={18} color="#fff" />
            <Text style={styles.joinGroupText}>Explore Study Groups</Text>
          </TouchableOpacity>
        </GlassView>


        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Posts</Text>
        {posts.map((post) => (
          <GlassView key={post.id} intensity={40} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={{ flexDirection: "row" }}>
                <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 14 }}>{post.user}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 10 }}>{post.time}</Text>
                </View>
              </View>
              {post.trending && (
                <View style={styles.trendingBadge}>
                  <Ionicons name="trending-up" size={14} color="#fff" />
                  <Text style={styles.trendingText}>Trending</Text>
                </View>
              )}
            </View>
            <Text style={{ color: theme.textPrimary, marginTop: 8 }}>{post.text}</Text>
            <View style={styles.postReactions}>
              <TouchableOpacity style={styles.reactionButton}>
                <Ionicons name="heart-outline" size={16} color={theme.textPrimary} />
                <Text style={{ color: theme.textPrimary, fontSize: 12, marginLeft: 4 }}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton}>
                <Ionicons name="chatbubble-outline" size={16} color={theme.textPrimary} />
                <Text style={{ color: theme.textPrimary, fontSize: 12, marginLeft: 4 }}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton}>
                <Ionicons name="share-outline" size={16} color={theme.textPrimary} />
                <Text style={{ color: theme.textPrimary, fontSize: 12, marginLeft: 4 }}>Share</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { marginHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 45, height: 45, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 10 },
  profileName: { fontSize: 16, fontWeight: "600" },
  profileId: { fontSize: 12 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 6 },
  scrollArea: { paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  eventCard: { width: 230, height: 200, borderRadius: 15, overflow: "hidden" },
  eventImage: { width: "100%", height: "100%", justifyContent: "flex-end" },
  eventOverlay: { borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10, backgroundColor: "rgba(0,0,0,0.33)" },
  eventTitle: { fontWeight: "700", fontSize: 15 },
  hotBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(255,69,0,0.9)", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  hotText: { color: "#fff", fontSize: 11, fontWeight: "600", marginLeft: 4 },
  insightsContainer: { marginHorizontal: 16, borderRadius: 20, padding: 15, marginBottom: 20 },
  insightsSubtitle: { fontSize: 12, marginBottom: 15 },
  insightsLabel: { fontSize: 14, fontWeight: "600", marginVertical: 12 },
  groupRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  groupBarBackground: { flex: 1, height: 12, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 6, marginHorizontal: 8, overflow: "hidden" },
  groupBarFill: { height: "100%", borderRadius: 6 },
  topGroupsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  groupCard: { flex: 1, marginHorizontal: 4, borderRadius: 14, padding: 10, alignItems: "center", overflow: "hidden" },
  cardTitle: { fontWeight: "600", marginTop: 5, fontSize: 13 },
  cardStat: { fontSize: 11, marginTop: 3 },
  joinGroupButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, paddingVertical: 10, borderRadius: 12 },
  joinGroupText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  postCard: { borderRadius: 15, padding: 10, marginHorizontal: 16, marginBottom: 12 },
  postHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  postAvatar: { width: 36, height: 36, borderRadius: 18 },
  trendingBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF4500", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  trendingText: { color: "#fff", fontSize: 10, marginLeft: 3 },
  postReactions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  reactionButton: { flexDirection: "row", alignItems: "center" },
});
