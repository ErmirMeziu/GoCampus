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
  ScrollView,
  ImageBackground,
  Modal,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "../context/ThemeProvider";

// Mock seed data — replace with API later
const SEED_GROUPS = [
  {
    id: "g1", name: "AI Club", category: "Tech", members: 128,
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
    tags: ["Python", "ML", "Workshops"],
    description: "Weekly hands-on sessions on ML, Kaggle challenges & paper club.",
    activity: 92, joined: true
  },
  {
    id: "g2", name: "Design Crew", category: "Arts", members: 86,
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&q=80",
    tags: ["Figma", "Branding", "UX"],
    description: "Crit nights, portfolio reviews and real campus briefs.",
    activity: 77, joined: false
  },
  {
    id: "g3", name: "Robotics Society", category: "Tech", members: 64,
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&q=80",
    tags: ["Arduino", "ROS", "3D Print"],
    description: "Build bots for national competitions — from line followers to swarm.",
    activity: 84, joined: false
  },
  {
    id: "g4", name: "Music Society", category: "Social", members: 142,
    image: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80",
    tags: ["Jam", "Choir", "Gigs"],
    description: "Open mics, jam sessions and gig nights across campus.",
    activity: 65, joined: false
  },
  {
    id: "g5", name: "Data Structures Study Group", category: "Study", members: 54,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    tags: ["Leet", "Peer-prep", "Whiteboard"],
    description: "Daily problem-solving sprints and mock interviews.",
    activity: 71, joined: true
  },
  {
    id: "g6", name: "Basketball", category: "Sports", members: 93,
    image: "https://images.unsplash.com/photo-1505666287802-931dc83948e1?w=800&q=80",
    tags: ["League", "Pickup", "Training"],
    description: "Evening pickup games, weekend league & skills drills.",
    activity: 58, joined: false
  },
];

/// --- Events are standalone (not linked to groups) ---
const SEED_EVENTS = [
  {
    id: "e1",
    title: "Hackathon 2025",
    date: "2025-10-23",
    time: "09:00",
    location: "Innovation Lab A",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
  },
  {
    id: "e2",
    title: "Study Night",
    date: "2025-10-22",
    time: "18:30",
    location: "Library Hall B",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
  },
];

const CATEGORIES = ["All", "Tech", "Arts", "Study", "Sports", "Social"];

export default function GroupsScreen() {
  const { theme, isDarkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [groups, setGroups] = useState(SEED_GROUPS);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [filterVisible, setFilterVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [createEventVisible, setCreateEventVisible] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    category: "All",
    joinedOnly: false,
    minMembers: "",
    minActivity: "",
  });

  // Create Group form
  const [newGroup, setNewGroup] = useState({
    name: "",
    category: "Tech",
    image: "",
    description: "",
    tags: "",
    activity: "",
    members: "",
    joined: true,
  });

  // Create Event form (standalone)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    image: "",
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  // Helpers
  const fmt = (d) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  // Visible groups (chips + search + filters)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => {
        const catOkTop = activeCat === "All" || g.category === activeCat;
        const qOk =
          !q ||
          g.name.toLowerCase().includes(q) ||
          g.tags.join(" ").toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q);
        const catOkFilter = filters.category === "All" || g.category === filters.category;
        const joinedOk = !filters.joinedOnly || g.joined;
        const minMembersOk = filters.minMembers === "" || g.members >= Number(filters.minMembers || 0);
        const minActivityOk = filters.minActivity === "" || g.activity >= Number(filters.minActivity || 0);
        return catOkTop && qOk && catOkFilter && joinedOk && minMembersOk && minActivityOk;
      })
      .sort((a, b) => b.activity - a.activity);
  }, [groups, query, activeCat, filters]);

  // All events, soonest first (not filtered by groups)
  const upcomingEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const myGroups = useMemo(() => groups.filter((g) => g.joined), [groups]);

  const toggleJoin = (id) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, joined: !g.joined } : g)));
  };

  const openCreate = () => setCreateVisible(true);
  const closeCreate = () => setCreateVisible(false);
  const openFilter = () => setFilterVisible(true);
  const closeFilter = () => setFilterVisible(false);
  const openCreateEvent = () => setCreateEventVisible(true);
  const closeCreateEvent = () => setCreateEventVisible(false);

  const resetCreateForm = () =>
    setNewGroup({
      name: "",
      category: "Tech",
      image: "",
      description: "",
      tags: "",
      activity: "",
      members: "",
      joined: true,
    });

  const saveGroup = () => {
    const name = newGroup.name.trim();
    if (!name) return;

    const id = `g${Date.now()}`;
    const tags = newGroup.tags.split(",").map((t) => t.trim()).filter(Boolean) || [];
    const activity = Math.max(0, Math.min(100, Number(newGroup.activity || 0)));
    const members = Math.max(1, Number(newGroup.members || 1));

    const created = {
      id,
      name,
      category: newGroup.category,
      members,
      image:
        newGroup.image ||
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      tags,
      description: newGroup.description || "Newly created group.",
      activity,
      joined: !!newGroup.joined,
    };

    setGroups((prev) => [created, ...prev]);
    resetCreateForm();
    closeCreate();
  };

  const saveEvent = () => {
    const title = newEvent.title.trim();
    if (!title || !newEvent.date) return;

    const created = {
      id: `e${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      image:
        newEvent.image ||
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    };
    setEvents((prev) => [created, ...prev]);
    closeCreateEvent();
  };

  const renderChip = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveCat(item)}
      style={[
        styles.chip,
        {
          backgroundColor: activeCat === item ? theme.primary : theme.card,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={{
          color: activeCat === item ? "#fff" : theme.textPrimary,
          fontWeight: "600",
          fontSize: 12,
        }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // -- Event card for the global Upcoming Events list (standalone)
  const renderEventCard = ({ item }) => (
    <GlassView intensity={60} style={[styles.eventCard, { backgroundColor: theme.card }]}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventBody}>
        <Text style={[styles.eventTitle, { color: theme.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.eventMeta, { color: theme.textMuted }]} numberOfLines={1}>
          📅 {fmt(item.date)} {item.time ? `• ${item.time}` : ""}   •  📍 {item.location}
        </Text>
      </View>
    </GlassView>
  );

  // -- Group card (NO per-group events; NO "Add Event" here)
  const renderGroup = ({ item }) => {
    return (
      <GlassView intensity={60} style={[styles.card, { backgroundColor: theme.card }]}>
        <Image source={{ uri: item.image }} style={styles.cover} />

        <View style={styles.cardBody}>
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
              style={[styles.secondaryBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.textPrimary} />
              <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleJoin(item.id)}
              style={[
                styles.primaryBtn,
                { backgroundColor: item.joined ? theme.danger : theme.primary },
              ]}
            >
              <Ionicons name={item.joined ? "log-out-outline" : "add"} size={18} color="#fff" />
              <Text style={styles.primaryText}>{item.joined ? "Leave" : "Join"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Themed background like Home */}
      <ImageBackground
        source={
          isDarkMode
            ? require("../assets/backgrounds/dark.png")
            : require("../assets/backgrounds/light.png")
        }
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Groups</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} onPress={openFilter}>
            <Ionicons name="funnel-outline" size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          {/* Add Event (standalone) */}
          <TouchableOpacity style={styles.headerIcon} onPress={openCreateEvent}>
            <Ionicons name="calendar-outline" size={22} color={theme.primary} />
          </TouchableOpacity>

          {/* Add Group */}
          <TouchableOpacity style={styles.headerIcon} onPress={openCreate}>
            <Ionicons name="add-circle-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <GlassView intensity={60} style={[styles.searchBox, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={16} color={theme.textMuted} />
        <TextInput
          placeholder="Search groups, tags, topics…"
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { color: theme.textPrimary }]}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </GlassView>

      {/* ===== STICKY SEARCH ABOVE — EVERYTHING BELOW SCROLLS TOGETHER ===== */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 16 }}
        // Header = chips + upcoming events + my groups (these scroll with the list)
        ListHeaderComponent={
          <View>
            {/* Categories (top chips) */}
            <View style={[styles.chipsWrap, { paddingHorizontal: 0 }]}>
              <FlatList
                data={CATEGORIES}
                horizontal
                keyExtractor={(i) => i}
                renderItem={renderChip}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0 }}
              />
            </View>

            {/* Upcoming Events (standalone) */}
            {upcomingEvents.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Events</Text>
                <FlatList
                  data={upcomingEvents}
                  keyExtractor={(e) => e.id}
                  horizontal
                  renderItem={renderEventCard}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                  style={{ marginBottom: 10 }}
                  // Make sure cards render at full height on some Android layouts
                  getItemLayout={(_, index) => ({ length: 170, offset: 170 * index, index })}
                />
              </>
            )}

            {/* My Groups carousel */}
            {myGroups.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>My Groups</Text>
                <FlatList
                  data={myGroups}
                  keyExtractor={(g) => g.id}
                  horizontal
                  renderItem={({ item: g }) => (
                    <GlassView intensity={50} style={[styles.miniCard, { backgroundColor: theme.card }]}>
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
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                  style={{ marginBottom: 6 }}
                />
              </View>
            )}

            {/* Section spacer before list items */}
            <View style={{ height: 4 }} />
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons name="cube-outline" size={28} color={theme.textMuted} />
            <Text style={{ color: theme.textMuted, marginTop: 8 }}>No groups match your filters.</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent onRequestClose={closeFilter}>
        <View style={styles.modalOverlay}>
          <GlassView style={[styles.modalCard, { backgroundColor: theme.overlay }]} intensity={90}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Filter Groups</Text>

            {/* Category */}
            <Text style={[styles.label, { color: theme.textMuted }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={`filter-${c}`}
                  onPress={() => setFilters((f) => ({ ...f, category: c }))}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: filters.category === c ? theme.primary : theme.card,
                      borderColor: theme.border,
                      marginBottom: 0,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: filters.category === c ? "#fff" : theme.textPrimary,
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Joined only */}
            <View style={styles.rowBetween}>
              <Text style={[styles.label, { color: theme.textMuted }]}>Joined only</Text>
              <Switch
                value={filters.joinedOnly}
                onValueChange={(v) => setFilters((f) => ({ ...f, joinedOnly: v }))}
                trackColor={{ false: "#777", true: theme.success }}
                thumbColor={"#fff"}
              />
            </View>

            {/* Minimums */}
            <View style={styles.row}>
              <View style={styles.inputCol}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Min members</Text>
                <TextInput
                  keyboardType="numeric"
                  value={filters.minMembers}
                  onChangeText={(t) => setFilters((f) => ({ ...f, minMembers: t.replace(/[^0-9]/g, "") }))}
                  placeholder="e.g. 50"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Min activity (0-100)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={filters.minActivity}
                  onChangeText={(t) => setFilters((f) => ({ ...f, minActivity: t.replace(/[^0-9]/g, "") }))}
                  placeholder="e.g. 60"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.card }]}
                onPress={() => {
                  setFilters({ category: "All", joinedOnly: false, minMembers: "", minActivity: "" });
                }}
              >
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={closeFilter}>
                <Text style={[styles.btnText, { color: "#fff" }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        </View>
      </Modal>

      {/* Create Group Modal */}
      <Modal visible={createVisible} animationType="slide" transparent onRequestClose={closeCreate}>
        <View style={styles.modalOverlay}>
          <GlassView style={[styles.modalCard, { backgroundColor: theme.overlay }]} intensity={90}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Create Group</Text>

            <Text style={[styles.label, { color: theme.textMuted }]}>Name</Text>
            <TextInput
              value={newGroup.name}
              onChangeText={(t) => setNewGroup((g) => ({ ...g, name: t }))}
              placeholder="e.g. Quantum Computing Society"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
            />

            <Text style={[styles.label, { color: theme.textMuted }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <TouchableOpacity
                  key={`create-cat-${c}`}
                  onPress={() => setNewGroup((g) => ({ ...g, category: c }))}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: newGroup.category === c ? theme.primary : theme.card,
                      borderColor: theme.border,
                      marginBottom: 0,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: newGroup.category === c ? "#fff" : theme.textPrimary,
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: theme.textMuted }]}>Description</Text>
            <TextInput
              value={newGroup.description}
              onChangeText={(t) => setNewGroup((g) => ({ ...g, description: t }))}
              placeholder="What is this group about?"
              placeholderTextColor={theme.textMuted}
              multiline
              style={[
                styles.input,
                { color: theme.textPrimary, borderColor: theme.border, height: 80, textAlignVertical: "top" },
              ]}
            />

            <Text style={[styles.label, { color: theme.textMuted }]}>Tags (comma separated)</Text>
            <TextInput
              value={newGroup.tags}
              onChangeText={(t) => setNewGroup((g) => ({ ...g, tags: t }))}
              placeholder="e.g. Python, Research, Meetups"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
            />

            <View style={styles.row}>
              <View style={styles.inputCol}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Activity (0-100)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={newGroup.activity}
                  onChangeText={(t) => setNewGroup((g) => ({ ...g, activity: t.replace(/[^0-9]/g, "") }))}
                  placeholder="e.g. 70"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Members</Text>
                <TextInput
                  keyboardType="numeric"
                  value={newGroup.members}
                  onChangeText={(t) => setNewGroup((g) => ({ ...g, members: t.replace(/[^0-9]/g, "") }))}
                  placeholder="e.g. 10"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                />
              </View>
            </View>

            <View style={styles.rowBetween}>
              <Text style={[styles.label, { color: theme.textMuted }]}>Join now</Text>
              <Switch
                value={newGroup.joined}
                onValueChange={(v) => setNewGroup((g) => ({ ...g, joined: v }))}
                trackColor={{ false: "#777", true: theme.success }}
                thumbColor={"#fff"}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.card }]} onPress={() => { resetCreateForm(); closeCreate(); }}>
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.primary, opacity: newGroup.name.trim() ? 1 : 0.5 }]}
                disabled={!newGroup.name.trim()}
                onPress={saveGroup}
              >
                <Text style={[styles.btnText, { color: "#fff" }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        </View>
      </Modal>

      {/* Create Event Modal (standalone) */}
      <Modal visible={createEventVisible} animationType="slide" transparent onRequestClose={closeCreateEvent}>
        <View style={styles.modalOverlay}>
          <GlassView style={[styles.modalCard, { backgroundColor: theme.overlay }]} intensity={90}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Create Event</Text>

            <Text style={[styles.label, { color: theme.textMuted }]}>Title</Text>
            <TextInput
              value={newEvent.title}
              onChangeText={(t) => setNewEvent((e) => ({ ...e, title: t }))}
              placeholder="e.g. Hack Night"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
            />

            <View style={styles.row}>
              <View style={styles.inputCol}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Date (YYYY-MM-DD)</Text>
                <TextInput
                  value={newEvent.date}
                  onChangeText={(t) => setNewEvent((e) => ({ ...e, date: t }))}
                  placeholder="2025-10-26"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Time (HH:MM)</Text>
                <TextInput
                  value={newEvent.time}
                  onChangeText={(t) => setNewEvent((e) => ({ ...e, time: t }))}
                  placeholder="18:00"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.textMuted }]}>Location</Text>
            <TextInput
              value={newEvent.location}
              onChangeText={(t) => setNewEvent((e) => ({ ...e, location: t }))}
              placeholder="e.g. Library Hall B"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
            />



            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.card }]} onPress={closeCreateEvent}>
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: theme.primary, opacity: newEvent.title.trim() && newEvent.date ? 1 : 0.5 },
                ]}
                disabled={!newEvent.title.trim() || !newEvent.date}
                onPress={saveEvent}
              >
                <Text style={[styles.btnText, { color: "#fff" }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenTitle: { fontSize: 22, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerIcon: { marginLeft: 8, padding: 6 },

  searchBox: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },

  chipsWrap: { marginTop: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginHorizontal: 16, marginBottom: 8, marginTop: 8 },

  // Upcoming events
  eventCard: { width: 240, borderRadius: 16, marginRight: 12, overflow: "hidden" },
  eventImage: { width: "100%", height: 110 },
  eventBody: { padding: 10 },
  eventTitle: { fontWeight: "700", fontSize: 14 },
  eventMeta: { fontSize: 11, marginTop: 4 },
  eventGroupRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 },
  eventGroupText: { fontSize: 11 },

  miniCard: { width: 160, borderRadius: 16, marginRight: 12, overflow: "hidden" },
  miniCover: { width: "100%", height: 86 },
  miniTitle: { fontSize: 13, fontWeight: "700" },
  miniMeta: { fontSize: 11 },

  card: { borderRadius: 18, overflow: "hidden", marginBottom: 12 },
  cover: { width: "100%", height: 150 },
  cardBody: { padding: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "700", flex: 1, paddingRight: 8 },

  activityPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  activityText: { marginLeft: 4, fontWeight: "700", fontSize: 12 },

  metaRow: { flexDirection: "row", marginTop: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  metaText: { marginLeft: 6, fontSize: 12 },

  desc: { marginTop: 8, fontSize: 12, lineHeight: 17 },

  // Per-group events chips (unused now, safe to keep or remove)
  eventsLabel: { marginTop: 10, fontWeight: "700", fontSize: 13 },
  evChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, marginRight: 8 },
  evChipText: { marginLeft: 6, fontSize: 11 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 8, marginBottom: 6, borderWidth: 1 },

  actionsRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  secondaryBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  secondaryText: { marginLeft: 8, fontWeight: "600", fontSize: 13 },

  primaryBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  primaryText: { marginLeft: 8, color: "#fff", fontWeight: "700", fontSize: 14 },

  // Modals
  modalOverlay: { flex: 1, padding: 16, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { borderRadius: 18, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  label: { fontSize: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontSize: 14 },
  row: { flexDirection: "row", gap: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  inputCol: { flex: 1 },

  modalButtons: { flexDirection: "row", gap: 10, marginTop: 6 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnText: { fontWeight: "700" },
});
