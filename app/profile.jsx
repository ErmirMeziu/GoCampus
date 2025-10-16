import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useRouter } from 'expo-router'; // ✅ to make router.back() work
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get('window');

export default function Profile() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    // Dynamically get status bar height (ignores safe area insets)
    getStatusBarHeight((h) => setStatusBarHeight(h));
  }, []);
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

  const pieData = [
    { name: "Notes", population: 45, color: "#4CAF50", legendFontColor: "#fff", legendFontSize: 12 },
    { name: "Books", population: 30, color: "#2196F3", legendFontColor: "#fff", legendFontSize: 12 },
    { name: "Videos", population: 25, color: "#FFC107", legendFontColor: "#fff", legendFontSize: 12 },
  ];

  const barData = {
    labels: ["AI", "Web", "DB", "Networks"],
    datasets: [{ data: [80, 60, 70, 50] }],
  };

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
    // <>
    //   <StatusBar hidden={false} translucent={true} backgroundColor="transparent" />
    //   <View style={styles.container}>
    //     {/* 🔴 Fixed Top Overlay */}
    //     <View style={[styles.topOverlay, { paddingTop: statusBarHeight }]}>
    //       <Text style={styles.text}>Top Edge (Overlaps Status Bar)</Text>
    //     </View>

    //     {/* 📜 Scrollable Main Content */}
    //     <ScrollView
    //       contentContainerStyle={styles.scrollContent}
    //       showsVerticalScrollIndicator={false}
    //     >
    //       <View style={styles.content}>
    //         <Text style={styles.title}>Scrollable Fullscreen Demo</Text>

    //         {[...Array(25)].map((_, i) => (
    //           <Text key={i} style={styles.text}>
    //             This is line {i + 1} of scrollable content — keep scrolling!
    //           </Text>
    //         ))}

    //         <Text style={styles.text}>
    //           Screen Width: {width}, Height: {height}
    //         </Text>
    //         <Text style={styles.text}>
    //           Status Bar Height Detected: {statusBarHeight}px
    //         </Text>
    //         <Text style={styles.text}>
    //           This layout ignores safe areas and lets you scroll under system UI elements like the notch and navigation bar.
    //         </Text>
    //       </View>
    //     </ScrollView>

    //     {/* ⚫ Fixed Bottom Overlay */}
    //     {/* <View style={styles.bottomOverlay}>
    //       <TouchableOpacity onPress={() => router.back()} style={styles.button}>
    //         <Text style={styles.link}>Go Back</Text>
    //       </TouchableOpacity>
    //     </View> */}
    //   </View>
    // </>
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

        {/* CHARTS */}
        <View style={styles.chartBox}>
          <Text style={styles.sectionTitleInside}>Campus Insights</Text>
          <Text style={styles.chartLabel}>Resource Usage</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 50}
            height={180}
            chartConfig={{
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              color: () => "#fff",
              labelColor: () => "#fff",
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
          <Text style={[styles.chartLabel, { marginTop: 15 }]}>Active Groups</Text>
          <BarChart
            data={barData}
            width={screenWidth - 50}
            height={180}
            chartConfig={{
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: () => "#fff",
              decimalPlaces: 0,
              propsForBackgroundLines: { strokeDasharray: "" },
            }}
            fromZero
            showValuesOnTopOfBars
            style={{ borderRadius: 16, marginTop: 5, alignSelf: "center" }}
          />
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
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollContent: {
    paddingTop: 80, // enough space under top overlay
    paddingBottom: 100, // enough space above bottom overlay
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    textAlign: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  link: {
    color: '#fff',
    fontSize: 16,
  },
  container: { flex: 1, paddingTop: 50, backgroundColor: "#000" },

  /* Header */
  header: { marginHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: "rgba(255,255,255,0.2)", width: 45, height: 45, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 10 },
  profileName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  profileId: { color: "#ccc", fontSize: 12 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 6 },

  scrollArea: { paddingBottom: 120 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  sectionTitleInside: { color: "#fff", fontSize: 17, fontWeight: "600", marginBottom: 10 },

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

  /* Charts */
  chartBox: { marginTop: 20, marginHorizontal: 16, borderRadius: 20, padding: 15, backgroundColor: "rgba(255,255,255,0.08)" },
  chartLabel: { color: "#ccc", fontSize: 14, marginVertical: 5 },

  /* Recent Posts */
  postCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 15, padding: 10, marginHorizontal: 16, marginBottom: 12 },
  postHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  postAvatar: { width: 36, height: 36, borderRadius: 18 },
  postUser: { color: "#fff", fontWeight: "600", fontSize: 14 },
  postTime: { color: "#ccc", fontSize: 10 },
  trendingBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF4500", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  trendingText: { color: "#fff", fontSize: 10, marginLeft: 3 },
  postText: { color: "#eee", fontSize: 13, marginTop: 8 },
  postReactions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },

  /* Bottom Nav */
  navBar: { position: "absolute", bottom: 10, left: 15, right: 15, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderRadius: 25, paddingVertical: 10, backgroundColor: "rgba(255,255,255,0.1)" },
  navItem: { alignItems: "center", flex: 1 },
  navText: { color: "#fff", fontSize: 11, marginTop: 3 },
  navItemCenter: { flex: 1, alignItems: "center" },
  postButton: { backgroundColor: "#fff", width: 55, height: 55, borderRadius: 27, justifyContent: "center", alignItems: "center", marginTop: -30, shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 3 }, shadowRadius: 4 },
});

