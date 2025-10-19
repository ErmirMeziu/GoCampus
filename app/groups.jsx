import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeProvider";

import EditGroupModal from "../components/EditGroupModal";
import CreateGroupModal from "../components/CreateGroupModal";
import CreateEventModal from "../components/CreateEventModal";
import GroupDetail from "../components/GroupDetail";
import EventCard from "../components/EventCard";


const SEED_GROUPS = [
  { id: "g1", name: "AI Club", category: "Tech", members: 128, image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80", tags: ["Python", "ML", "Workshops"], description: "Weekly hands-on sessions on ML, Kaggle challenges & paper club.", activity: 92, joined: true },
  { id: "g2", name: "Design Crew", category: "Arts", members: 86, image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&q=80", tags: ["Figma", "Branding", "UX"], description: "Crit nights, portfolio reviews and real campus briefs.", activity: 77, joined: false },
  { id: "g3", name: "Robotics Society", category: "Tech", members: 64, image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&q=80", tags: ["Arduino", "ROS", "3D Print"], description: "Build bots for national competitions — from line followers to swarm.", activity: 84, joined: false },
  { id: "g4", name: "Music Society", category: "Social", members: 142, image: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80", tags: ["Jam", "Choir", "Gigs"], description: "Open mics, jam sessions and gig nights across campus.", activity: 65, joined: false },
  { id: "g5", name: "Data Structures Study Group", category: "Study", members: 54, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80", tags: ["Leet", "Peer-prep", "Whiteboard"], description: "Daily problem-solving sprints and mock interviews.", activity: 71, joined: true },
  { id: "g6", name: "Basketball", category: "Sports", members: 93, image: "https://images.unsplash.com/photo-1505666287802-931dc83948e1?w=800&q=80", tags: ["League", "Pickup", "Training"], description: "Evening pickup games, weekend league & skills drills.", activity: 58, joined: false },
];

const SEED_EVENTS = [
  { id: "e1", title: "Hackathon 2025", date: "2025-10-23", time: "09:00", location: "Innovation Lab A", image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80", groupId: "g1" },
  { id: "e2", title: "Study Night", date: "2025-10-22", time: "18:30", location: "Library Hall B", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80", groupId: null },
];

const CATEGORIES = ["All", "Tech", "Arts", "Study", "Sports", "Social"];

export default function GroupsScreen() {
  const { theme, isDarkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [groups, setGroups] = useState(SEED_GROUPS);
  const [events, setEvents] = useState(SEED_EVENTS);

  const [refreshing, setRefreshing] = useState(false);
  const [detailGroup, setDetailGroup] = useState(null);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [createEventVisible, setCreateEventVisible] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...groups]
      .filter((g) => {
        const catOk = activeCat === "All" || g.category === activeCat;
        const qOk =
          !q ||
          g.name.toLowerCase().includes(q) ||
          g.tags.join(" ").toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q);
        return catOk && qOk;
      })
      .sort((a, b) => {
        if (b.joined - a.joined !== 0) return b.joined - a.joined;
        return b.activity - a.activity;
      });
  }, [groups, query, activeCat]);

  const myGroups = useMemo(() => groups.filter((g) => g.joined), [groups]);
  const upcomingEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const toggleJoin = (id) =>
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, joined: !g.joined } : g)));

  const openEditMyGroup = (g) => {
    setSelectedGroup(g);
    setEditVisible(true);
  };

  const saveEditedGroup = (updated) => {
    setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    setEditVisible(false);
  };

  const deleteGroup = (groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setEvents((prev) => prev.filter((e) => e.groupId !== groupId));
    setEditVisible(false);
    if (detailGroup?.id === groupId) setDetailGroup(null);
  };

  const createGroup = (payload) => {
    const created = { ...payload, id: `g${Date.now()}` };
    setGroups((prev) => [created, ...prev]);
    setCreateGroupVisible(false);
  };

  const createEvent = (payload) => {
    const created = { ...payload, id: `e${Date.now()}` };
    setEvents((prev) => [created, ...prev]);
    setCreateEventVisible(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });
    return result?.canceled ? null : result.assets?.[0]?.uri ?? null;
  };

  const renderEventCard = ({ item }) => (
    <GlassView glassEffectStyle="clear" intensity={60} style={[styles.eventCard, { backgroundColor: theme.card }]}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventBody}>
        <Text style={[styles.eventTitle, { color: theme.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.eventMeta, { color: theme.textMuted }]} numberOfLines={1}>
          📅 {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • {item.time || "—"} • 📍 {item.location || "TBA"}
        </Text>
      </View>
    </GlassView>
  );

  const renderGroup = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setDetailGroup(item)}>
      <GlassView glassEffectStyle="clear" intensity={60} style={[styles.groupCard, { backgroundColor: theme.card }]}>
        <Image source={{ uri: item.image }} style={styles.groupCover} />
        <View style={styles.groupBody}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={[styles.activityPill, { backgroundColor: theme.overlay }]}>
              <Ionicons name="flame" size={12} color={theme.accent} />
              <Text style={[styles.activityText, { color: theme.textPrimary }]}>{item.activity}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{item.members} members</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{item.category}</Text>
            </View>
          </View>

          <Text style={[styles.desc, { color: theme.textMuted }]} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.tagsRow}>
            {item.tags.map((t, i) => (
              <View
                key={`${item.id}-tag-${i}`}
                style={[styles.tag, { borderColor: theme.border, backgroundColor: theme.overlay }]}
              >
                <Text style={{ color: theme.textPrimary, fontSize: 11 }}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => toggleJoin(item.id)}
              style={[styles.primaryBtn, { backgroundColor: item.joined ? theme.danger : theme.primary }]}
            >
              <Ionicons name={item.joined ? "log-out-outline" : "add"} size={18} color="#fff" />
              <Text style={styles.primaryText}>{item.joined ? "Leave" : "Join"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassView>
    </TouchableOpacity>
  );

  const mainView = (
    <>
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Groups</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setCreateEventVisible(true)}>
            <Ionicons name="calendar-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setCreateGroupVisible(true)}>
            <Ionicons name="add-circle-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <GlassView intensity={60} style={[styles.filterHeader, { backgroundColor: theme.card }]}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            placeholder="Search groups, tags, topics…"
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </GlassView>

      <View style={styles.categoriesWrap}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCat(cat)}
            style={[
              styles.chip,
              { backgroundColor: activeCat === cat ? theme.primary : theme.overlay, borderColor: theme.border },
            ]}
          >
            <Text style={{ color: activeCat === cat ? "#fff" : theme.textPrimary, fontWeight: "600", fontSize: 12 }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <View>
            {upcomingEvents.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Events</Text>
                <FlatList
                  data={upcomingEvents}
                  keyExtractor={(e) => e.id}
                  horizontal
                  renderItem={({ item }) => <EventCard item={item} theme={theme} />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                  style={{ marginBottom: 10 }}
                />
              </>
            )}

            {myGroups.length > 0 && (
              <View style={{ marginTop: 6, marginBottom: 10 }}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>My Groups</Text>
                <FlatList
                  data={myGroups}
                  horizontal
                  keyExtractor={(g) => g.id}
                  renderItem={({ item: g }) => (
                    <TouchableOpacity onPress={() => openEditMyGroup(g)}>
                      <GlassView glassEffectStyle="clear" intensity={50} style={[styles.miniCard, { backgroundColor: theme.card }]}>
                        <Image source={{ uri: g.image }} style={styles.miniCover} />
                        <View style={{ padding: 10 }}>
                          <Text style={[styles.miniTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                            {g.name}
                          </Text>
                          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                            <Ionicons name="people-outline" size={12} color={theme.textMuted} />
                            <Text style={[styles.miniMeta, { color: theme.textMuted }]}> {g.members}</Text>
                          </View>
                        </View>
                      </GlassView>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                />
              </View>
            )}
          </View>
        }
      />
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageBackground
        source={isDarkMode ? require("../assets/backgrounds/dark.png") : require("../assets/backgrounds/light.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {!detailGroup ? (
        mainView
      ) : (
        <GroupDetail
          group={detailGroup}
          onBack={() => setDetailGroup(null)}
          theme={theme}
          events={events.filter((e) => e.groupId === detailGroup.id)}
          onJoinToggle={() => toggleJoin(detailGroup.id)}
          onCreateEvent={() => setCreateEventVisible(true)}
        />
      )}

      {editVisible && selectedGroup && (
        <EditGroupModal
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          group={selectedGroup}
          onSave={saveEditedGroup}
          onDelete={() => deleteGroup(selectedGroup.id)}
        />
      )}

      {createGroupVisible && (
        <CreateGroupModal
          visible={createGroupVisible}
          onClose={() => setCreateGroupVisible(false)}
          onSave={createGroup}
          pickImage={pickImage}
        />
      )}

      {createEventVisible && (
        <CreateEventModal
          visible={createEventVisible}
          onClose={() => setCreateEventVisible(false)}
          onSave={createEvent}
          groups={[{ id: null, name: "No group" }, ...groups.map(({ id, name }) => ({ id, name }))]}
          pickImage={pickImage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: { marginTop: 45, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  screenTitle: { fontSize: 24, fontWeight: "700" },
  headerBtn: { padding: 6, marginLeft: 8 },

  filterHeader: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 12, marginBottom: 10 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8},
  searchInput: { flex: 1, fontSize: 14 },

  categoriesWrap: { flexDirection: "row", flexWrap: "wrap", alignSelf: "center" },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, marginBottom: 8, borderWidth: 1 },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginHorizontal: 16, marginBottom: 8, marginTop: 8 },

  eventCard: { width: 240, borderRadius: 16, marginRight: 12, overflow: "hidden" },
  eventImage: { width: "100%", height: 110 },
  eventBody: { padding: 10 },
  eventTitle: { fontWeight: "700", fontSize: 14 },
  eventMeta: { fontSize: 11, marginTop: 4 },

  miniCard: { width: 170, borderRadius: 16, marginRight: 12, overflow: "hidden" },
  miniCover: { width: "100%", height: 86 },
  miniTitle: { fontSize: 13, fontWeight: "700" },
  miniMeta: { fontSize: 11 },

  groupCard: { borderRadius: 18, overflow: "hidden", marginBottom: 14 },
  groupCover: { width: "100%", height: 150 },
  groupBody: { padding: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "700", flex: 1, paddingRight: 8 },
  activityPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  activityText: { marginLeft: 4, fontWeight: "700", fontSize: 12 },
  metaRow: { flexDirection: "row", marginTop: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  metaText: { marginLeft: 6, fontSize: 12 },
  desc: { marginTop: 8, fontSize: 12, lineHeight: 17 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 8, marginBottom: 6, borderWidth: 1 },
  actionsRow: { flexDirection: "row", marginTop: 12, justifyContent: "flex-end" },
  primaryBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  primaryText: { marginLeft: 8, color: "#fff", fontWeight: "700", fontSize: 14 },
});
