import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";

export default function HomeScreen() {
  const screenWidth = Dimensions.get("window").width;

  const events = [
    {
      id: "1",
      title: "Hackathon 2025",
      date: "Oct 20",
      location: "Innovation Hall",
      description: "Showcase your coding skills and build creative solutions with your peers.",
      image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1000&q=80",
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
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80",
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
      image: "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?auto=format&fit=crop&w=1000&q=80",
      likes: 89,
      comments: 15,
      isHot: true,
    },
  ];

  const barData = {
    labels: ["AI", "Web", "DB", "Networks"],
    datasets: [{ data: [80, 60, 70, 50] }],
  };

  const colors = [
    "rgba(61, 231, 19, 0.8)",
    "rgba(240, 43, 4, 0.8)",
    "rgba(6, 73, 244, 0.8)",
    "rgba(90, 140, 255, 0.8)"
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

  return (
    <View style={styles.container}>
      {/* Background */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80",
        }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={15}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={26} color="#fff" />
          </View>
          <View>
            <Text style={styles.profileName}>Ermir Meziu</Text>
            <Text style={styles.profileId}>ID: 230756100</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color="#fff" style={styles.icon} />
          <Ionicons name="search-outline" size={22} color="#fff" style={styles.icon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {/* UPCOMING EVENTS */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <FlatList
          data={events}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} style={styles.eventCard}>
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
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDate}>📅 {item.date}</Text>
                  <Text style={styles.eventLocation}>📍 {item.location}</Text>
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.reactionBar}>
                    <TouchableOpacity style={styles.reactionButton}>
                      <Ionicons name="heart-outline" size={16} color="#fff" />
                      <Text style={styles.reactionText}>{item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionButton}>
                      <Ionicons name="chatbubble-outline" size={16} color="#fff" />
                      <Text style={styles.reactionText}>{item.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.joinButton}>
                      <Ionicons name="add-circle" size={18} color="#000" />
                      <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        {/* CAMPUS INSIGHTS */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Campus Insights</Text>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsSubtitle}>
            Discover how active each study group is on campus — join one to boost your learning!
          </Text>

          {/* Chart 1: Group Participation */}
          <Text style={styles.insightsLabel}>Group Participation</Text>
          <View style={{ marginBottom: 15 }}>
            {barData.labels.map((label, index) => {
              const value = barData.datasets[0].data[index];
              return (
                <View key={index} style={styles.groupRow}>
                  <Text style={styles.groupName}>{label}</Text>
                  <View style={styles.groupBarBackground}>
                    <View
                      style={[
                        styles.groupBarFill,
                        {
                          width: `${value}%`,
                          backgroundColor: colors[index % colors.length]

                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.groupValue}>{value}</Text>
                </View>
              );
            })}
          </View>

          {/* Top Performing Groups */}
          <Text style={styles.insightsLabel}>Top Performing Groups</Text>
          <View style={styles.topGroupsContainer}>
            {[
              { icon: "flame", name: "AI Club", stat: "12 Projects" },
              { icon: "musical-notes", name: "Music Society", stat: "8 Events" },
              { icon: "brush", name: "Design Crew", stat: "15 Works" },
            ].map((group, index) => (
              <View key={index} style={styles.groupCard}>
                <Ionicons name={group.icon} size={22} color="#fff" />
                <Text style={styles.cardTitle}>{group.name}</Text>
                <Text style={styles.cardStat}>{group.stat}</Text>
              </View>
            ))}
          </View>

          {/* Join Groups Button */}
          <TouchableOpacity style={styles.joinGroupButton}>
            <Ionicons name="people" size={18} color="#000" />
            <Text style={styles.joinGroupText}>Explore Study Groups</Text>
          </TouchableOpacity>
        </View>


        {/* RECENT POSTS */}
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Header: Avatar + Name + Time */}
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.postUser}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
              {post.trending && (
                <View style={styles.trendingBadge}>
                  <Ionicons name="trending-up" size={14} color="#fff" />
                  <Text style={styles.trendingText}>Trending</Text>
                </View>
              )}
            </View>

            {/* Content */}
            <Text style={styles.postText}>{post.text}</Text>

            {/* Reactions */}
            <View style={styles.postReactions}>
              <TouchableOpacity style={styles.reactionButton}>
                <Ionicons name="heart-outline" size={16} color="#fff" />
                <Text style={styles.reactionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#fff" />
                <Text style={styles.reactionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton}>
                <Ionicons name="share-outline" size={16} color="#fff" />
                <Text style={styles.reactionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#000" },

  /* Header */
  header: { marginHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8 },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: "rgba(255,255,255,0.2)", width: 45, height: 45, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 10 },
  profileName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  profileId: { color: "#ccc", fontSize: 12 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 6 },

  scrollArea: { paddingBottom: 120, top: 0 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginHorizontal: 16, marginTop: 20, marginBottom: 10 },

  /* Events */
  eventCard: { width: 230, height: 200, marginRight: 15, borderRadius: 15, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.1)", shadowColor: "#000", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5 },
  eventImage: { width: "100%", height: "100%", justifyContent: "flex-end" },
  eventOverlay: { backgroundColor: "rgba(0,0,0,0.55)", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10 },
  eventTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  eventDate: { color: "#FFD700", fontSize: 12, marginTop: 2 },
  eventLocation: { color: "#ccc", fontSize: 12, marginTop: 1 },
  eventDescription: { color: "#eee", fontSize: 12, marginTop: 5 },
  hotBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(255,69,0,0.9)", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, shadowColor: "#FF4500", shadowOpacity: 0.6, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  hotText: { color: "#fff", fontSize: 11, fontWeight: "600", marginLeft: 4 },
  reactionBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  reactionButton: { flexDirection: "row", alignItems: "center" },
  reactionText: { color: "#fff", fontSize: 12, marginLeft: 4 },
  joinButton: { backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  joinButtonText: { color: "#000", fontWeight: "600", marginLeft: 5, fontSize: 13 },


  /* Insights */
  insightsContainer: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  insightsSubtitle: { color: "#ccc", fontSize: 12, marginBottom: 15 },
  insightsLabel: { color: "#fff", fontSize: 14, fontWeight: "600", marginBottom: 8 },

  groupRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  groupName: { color: "#fff", width: 50, fontSize: 12 },
  groupBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  groupBarFill: { height: "100%", borderRadius: 6 },
  groupValue: { color: "#fff", width: 30, fontSize: 12, textAlign: "right" },

  joinGroupButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinGroupText: { color: "#000", fontWeight: "600", marginLeft: 6 },

  topGroupsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  groupCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 4,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 5,
    fontSize: 13,
  },
  cardStat: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 3,
  },

  /* Posts */
  postCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postAvatar: { width: 36, height: 36, borderRadius: 18 },
  postUser: { color: "#fff", fontWeight: "600", fontSize: 14 },
  postTime: { color: "#ccc", fontSize: 10 },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4500",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendingText: { color: "#fff", fontSize: 10, marginLeft: 3 },
  postText: { color: "#eee", fontSize: 13, marginTop: 8 },
  postReactions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  /* Bottom Nav */
  navBar: { position: "absolute", bottom: 10, left: 15, right: 15, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderRadius: 25, paddingVertical: 10, backgroundColor: "rgba(255,255,255,0.1)" },
  navItem: { alignItems: "center", flex: 1 },
  navText: { color: "#fff", fontSize: 11, marginTop: 3 },
  navItemCenter: { flex: 1, alignItems: "center" },
  postButton: { backgroundColor: "#fff", width: 55, height: 55, borderRadius: 27, justifyContent: "center", alignItems: "center", marginTop: -30, shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 3 }, shadowRadius: 4 },
});
