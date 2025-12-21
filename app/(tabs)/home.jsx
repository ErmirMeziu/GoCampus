import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, Image,Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeProvider";
import { GlassView } from "expo-glass-effect";
import { auth, db } from "../../firebase/config";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { createEvent, listenEvents, likeEvent } from "../../firebase/home";
import { listenGroups, listenUpcomingEventsForUser } from "../../firebase/groups";
import { listenAllResources } from "../../firebase/resources";
import { restoreImages } from "../../utils/imageUtils";
import { calculateCategoryInsights } from "../../components/Insights";
import CourseCompanion from "../../components/CourseCompanion";
import { useFocusEffect } from "@react-navigation/native";
import FadeButton from "../../components/FadeButton";

const getItemDate = (item) => {
  if (!item) return null;

  // ✅ Prefer the scheduled event date + time
  if (item.date) {
    // Firestore Timestamp
    if (typeof item.date === "object" && item.date?.toDate) {
      return item.date.toDate();
    }

    if (typeof item.date === "string") {
      const dateStr = item.date.trim();

      // If it's "YYYY-MM-DD", merge with time if exists, otherwise end-of-day
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split("-").map(Number);

        // time "HH:MM" (from your modal)
        if (typeof item.time === "string" && /^\d{2}:\d{2}$/.test(item.time.trim())) {
          const [hh, mm] = item.time.trim().split(":").map(Number);
          return new Date(y, m - 1, d, hh, mm, 0, 0);
        }

        // no time → treat as end of day
        return new Date(y, m - 1, d, 23, 59, 59, 999);
      }

      // ISO or other
      const parsed = new Date(dateStr);
      if (!isNaN(parsed)) return parsed;
    }
  }

  // fallback for other feed items (groups/resources)
  const raw = item.dateCreated || item.createdAt;
  if (!raw) return null;
  if (typeof raw === "object" && raw?.toDate) return raw.toDate();

  const parsed = new Date(raw);
  return isNaN(parsed) ? null : parsed;
};


const timeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
};

const getEventImageSource = (event) => {
  if (Array.isArray(event?.imageBase64)) {
    const restored = restoreImages(event.imageBase64);
    if (restored?.length?.[0]?.uri) return { uri: restored[0].uri };
    if (restored?.length && restored[0]?.base64) {
      return { uri: `data:image/jpeg;base64,${restored[0].base64}` };
    }
  }

  if (typeof event?.imageBase64 === "string" && event.imageBase64.trim()) {
    const b64 = event.imageBase64.trim();
    if (b64.startsWith("data:image")) return { uri: b64 };
    return { uri: `data:image/jpeg;base64,${b64}` };
  }

  if (typeof event?.image === "string" && event.image.trim()) {
    return { uri: event.image.trim() };
  }

  return {
    uri: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1000&q=80",
  };
};


const randomColor = () => `hsl(${Math.floor(Math.random() * 360)},65%,70%)`;

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const user = auth.currentUser;
  const userName = user?.displayName || "Student";
  const userId = user?.uid?.slice(0, 8) || "Unknown";
  const userUid = user?.uid || null;
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [resources, setResources] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);


useEffect(() => {
  if (!auth.currentUser?.uid) return;

  setLoading(true);

  const unsub = listenUpcomingEventsForUser(auth.currentUser.uid, (list) => {
    setEvents(list || []);
    setLoading(false);
  });

  return () => unsub && unsub();
}, []);




  useEffect(() => {
    const unsub = listenGroups(list => setGroups(list || []));
    return () => unsub && unsub();
  }, []);

  useEffect(() => {
    const unsub = listenAllResources(list => setResources(list || []));
    return () => unsub && unsub();
  }, []);

  const insights = useMemo(() => calculateCategoryInsights(groups), [groups]);

  const upcomingEvents = useMemo(() => {
  const now = new Date();
  return [...events]
    .filter((e) => {
      const d = getItemDate(e);
      return d && d >= now;
    })
    .sort((a, b) => getItemDate(a) - getItemDate(b));
}, [events]);


  const recentUpdates = useMemo(() => {
    const eventEntries = events.map(e => ({ ...e, _type: "event", _time: getItemDate(e) }));
    const groupEntries = groups.map(g => ({ ...g, _type: "group", _time: getItemDate(g) }));
    const resourceEntries = resources.map(r => ({ ...r, _type: "resource", _time: getItemDate(r) }));
    return [...eventEntries, ...groupEntries, ...resourceEntries]
      .filter(x => !!x._time)
      .sort((a, b) => b._time - a._time);
  }, [events, groups, resources]);

  useEffect(() => {
    const cache = {};
    Promise.all(
      recentUpdates.map(async item => {
        const uid = item?.createdBy;
        if (!uid || cache[uid]) return;
        try {
          const snap = await getDoc(doc(db, "users", uid));
          cache[uid] = snap.exists() ? snap.data() : { name: "Unknown User", photoURL: null };
        } catch {
          cache[uid] = { name: "Unknown User", photoURL: null };
        }
      })
    ).then(() => setUserProfiles(cache));
  }, [recentUpdates]);


  const shareEvent = async (event) => {
  try {
    const message = `
🎓 GoCampus Event

📌 ${event.title}
📍 ${event.location || "Campus"}
📅 ${event.date || "To be announced"}

👉 Open in GoCampus:
gocampus://event/${event.id}

🌐 Web link:
https://gocampus.app/event/${event.id}
    `;

    await Share.share({ message });
  } catch (error) {
    console.log("Share failed:", error);
  }
};



  return (
    <View style={styles.container}>
      <ImageBackground source={isDarkMode ? require("../../assets/backgrounds/dark.png") : require("../../assets/backgrounds/light.png")} style={StyleSheet.absoluteFillObject} />
      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <GlassView intensity={40} style={styles.avatar}>
              <Ionicons name="person" size={26} color={theme.textPrimary} />
            </GlassView>

            <View>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>
                {userName}
              </Text>
              <Text style={[styles.profileId, { color: theme.textMuted }]}>
                ID: {userId}
              </Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme.textPrimary}
                style={styles.icon}
              />
            </TouchableOpacity>

            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.textPrimary}
              style={styles.icon}
            />


          </View>
        </View>
        <CourseCompanion
          resources={resources}
          groups={groups}
          events={events}
        />

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Events</Text>
        <FlatList
          data={upcomingEvents}
          horizontal
          keyExtractor={(it, idx) => it.id || idx.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const img = getEventImageSource(item);
            const date = getItemDate(item);
            return (
              <TouchableOpacity activeOpacity={0.85} style={{ marginRight: 15 }}>
                <GlassView intensity={60} style={styles.eventCard}>
                  <ImageBackground source={img} style={styles.eventImage} imageStyle={{ borderRadius: 15 }}>
                    <View style={styles.eventOverlay}>
                      <Text style={[styles.eventTitle, { color: "white" }]}>
                        {item?.title}
                      </Text>

                      <FadeButton onPress={() => shareEvent(item)}>
                        <View style={{ alignSelf: "flex-end", marginTop: 8 }}>
                          <Ionicons name="share-outline" size={18} color="white" />
                        </View>
                      </FadeButton>

                      <Text style={{ color: theme.secondary, fontSize: 12 }}> 📅 {date ? date.toLocaleDateString() : "TBD"} </Text>

                      <Text style={{ color: theme.secondary, fontSize: 11 }}> ⏰ {item?.time || "Not set"} </Text>

                      <Text style={{ color: theme.secondary, fontSize: 11 }}> 📍 {item?.location || "Unknown"} </Text>
                    </View>
                  </ImageBackground>
                </GlassView>
              </TouchableOpacity>
            );
          }}
        />





        <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 25 }]}>Campus Insights</Text>
        <GlassView glassEffectStyle="clear" intensity={50} style={styles.insightsContainer}>
          <Text style={[styles.insightsSubtitle, { color: theme.textMuted }]}>
            Discover how active each study group is on campus - join one to boost your learning!
          </Text>
          {insights.barData.labels.length === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Not enough groups yet.</Text>
          ) : (
            insights.barData.labels.map((label, idx) => (
              <View key={label} style={styles.groupRow}>
                <Text style={{ color: theme.textPrimary, width: 80, fontSize: 12 }}>{label}</Text>
                <View style={styles.groupBarBackground}>
                  <View style={[styles.groupBarFill, { width: `${Math.min(insights.barData.values[idx] * 15, 100)}%`, backgroundColor: randomColor() }]} />
                </View>
                <Text style={{ color: theme.textPrimary, width: 30, fontSize: 12, textAlign: "right" }}>
                  {insights.barData.values[idx]}
                </Text>
              </View>
            ))
          )}
          <Text style={[styles.insightsLabel, { color: theme.textPrimary }]}>Top Performing Groups</Text>
          <View style={styles.topGroupsContainer}>
            {(insights.topGroups || []).map((group, index) => (
              <GlassView glassEffectStyle="clear" key={index} intensity={50} style={[styles.groupCard,]}>
                <Ionicons name={group.icon} size={22} color={theme.textPrimary} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{group.name}</Text>
                <Text style={[styles.cardStat, { color: theme.textMuted }]}>{group.stat}</Text>
              </GlassView>
            ))}
          </View>
        </GlassView>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Updates</Text>
        <GlassView glassEffectStyle="clear" intensity={50} style={styles.feedWindow}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={[{ marginTop: 2 }]}>
            {recentUpdates.map((item, idx) => {
              const creator = item?.createdBy ? userProfiles[item.createdBy] : null;
              const name = creator?.name || "Loading...";
              const avatar = creator?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              const verb = item._type === "event" ? "created an event" : item._type === "group" ? "created a group" : "uploaded a resource";
              return (
                <GlassView glassEffectStyle="regular" key={idx} intensity={40} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image source={{ uri: avatar }} style={styles.postAvatar} />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600" }}> {name} • {verb} </Text>
                        <Text style={{ color: theme.textMuted, fontSize: 10 }}> {timeAgo(item._time)} </Text>
                      </View>
                    </View>
                  </View>
                </GlassView>
              );
            })}
          </ScrollView>
        </GlassView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  scrollArea: { paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginHorizontal: 16, marginBottom: 10, marginTop: -16 },
  eventCard: { width: 230, height: 200, borderRadius: 15, overflow: "hidden" },
  eventImage: { width: "100%", height: "100%", justifyContent: "flex-end" },
  eventOverlay: { padding: 10, backgroundColor: "rgba(0,0,0,0.33)", borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  eventTitle: { fontWeight: "700", fontSize: 15 },
  insightsContainer: { marginHorizontal: 16, borderRadius: 20, padding: 15, marginBottom: 40 },
  insightsSubtitle: { fontSize: 12, marginBottom: 15 },
  insightsLabel: { fontSize: 14, fontWeight: "600", marginVertical: 12 },
  groupRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  groupBarBackground: { flex: 1, height: 12, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 6, marginHorizontal: 8, overflow: "hidden" },
  groupBarFill: { height: "100%", borderRadius: 6 },
  topGroupsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  groupCard: { flex: 1, marginHorizontal: 4, borderRadius: 16, padding: 10, alignItems: "center" },
  cardTitle: { fontWeight: "600", marginTop: 5, fontSize: 13 },
  cardStat: { fontSize: 11, marginTop: 3 },
  postCard: { borderRadius: 15, padding: 10, marginHorizontal: 16, marginBottom: 12 },
  postHeader: { flexDirection: "row", alignItems: "center" },
  postAvatar: { width: 36, height: 36, borderRadius: 18 },
  feedWindow: { maxHeight: 195, marginHorizontal: 16, overflow: "hidden", borderRadius: 16, },
  header: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },

  profileId: {
    fontSize: 12,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginHorizontal: 6,
  },

});
