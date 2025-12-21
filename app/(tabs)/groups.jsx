import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
import { useTheme } from "../../context/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";



import EditGroupModal from "../../components/EditGroupModal";
import CreateGroupModal from "../../components/CreateGroupModal";
import CreateEventModal from "../../components/CreateEventModal";
import GroupDetail from "../../components/GroupDetail";
import EventCard from "../../components/EventCard";
import FadeButton from "../../components/FadeButton";

import {
  listenGroups,
  listenEvents,
  createGroupDB,
  createEventDB,
  toggleJoinDB,
} from "../../firebase/groups";

import { pickImages } from "../../utils/imageUtils";
import { auth } from "../../firebase/config";

const CATEGORIES = ["All", "Tech", "Arts", "Study", "Sports", "Social"];

const getItemDate = (item) => {
  if (!item) return null;

  if (item.date) {
    if (typeof item.date === "object" && item.date?.toDate) {
      return item.date.toDate();
    }

    if (typeof item.date === "string") {
      const dateStr = item.date.trim();

      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split("-").map(Number);

        if (typeof item.time === "string" && /^\d{2}:\d{2}$/.test(item.time.trim())) {
          const [hh, mm] = item.time.trim().split(":").map(Number);
          return new Date(y, m - 1, d, hh, mm, 0, 0);
        }

        return new Date(y, m - 1, d, 23, 59, 59, 999);
      }

      const parsed = new Date(dateStr);
      if (!isNaN(parsed)) return parsed;
    }
  }

  if (item.createdAt) {
    const parsed = new Date(item.createdAt);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
};


export default function GroupsScreen() {
  const { theme, isDarkMode } = useTheme();
  const { scrollTo } = useLocalSearchParams();


  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [highlightId, setHighlightId] = useState(null);

  const listRef = useRef(null);


  const [refreshing, setRefreshing] = useState(false);
  const [detailGroup, setDetailGroup] = useState(null);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [createEventVisible, setCreateEventVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQuery("");
        setActiveCat("All");
        setDetailGroup(null);

        requestAnimationFrame(() => {
          if (listRef.current) {
            listRef.current.scrollToOffset({
              offset: 0,
              animated: false,
            });
          }
        });
      };
    }, [])
  );




  useEffect(() => {
    const unsubGroups = listenGroups((allGroups) => {
      setGroups(
        allGroups.map((g) => ({
          ...g,
          image: g.imageBase64 ? `data:image/jpeg;base64,${g.imageBase64}` : g.image,
          joined: !!g.joinedBy?.includes(auth.currentUser?.uid),
        }))
      );
    });

    const unsubEvents = listenEvents((allEvents) => {
      setEvents(
        allEvents.map((e) => ({
          ...e,
          image: e.imageBase64 ? `data:image/jpeg;base64,${e.imageBase64}` : e.image,
        }))
      );
    });

    return () => {
      unsubGroups();
      unsubEvents();
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();

    return [...groups]
      .filter((g) => {
        const catOk = activeCat === "All" || g.category === activeCat;
        const qOk =
          !q ||
          g.name.toLowerCase().includes(q) ||
          g.tags?.join(" ").toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q);

        return catOk && qOk;
      })
      .sort((a, b) => {
        if (b.joined - a.joined !== 0) return b.joined - a.joined;
        return (b.activity || 0) - (a.activity || 0);
      });
  }, [groups, query, activeCat]);

  useEffect(() => {
    if (!scrollTo) return;
    if (!listRef.current) return;
    if (filteredGroups.length === 0) return;

    const index = filteredGroups.findIndex(g => g.id === scrollTo);
    if (index === -1) return;

    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.45,
      });

      setHighlightId(scrollTo);
      setTimeout(() => setHighlightId(null), 2000);
    }, 350);
  }, [scrollTo, filteredGroups]);



  const myGroups = useMemo(
    () => groups.filter((g) => g.ownerId === auth.currentUser?.uid),
    [groups]
  );

  const upcomingEvents = useMemo(() => {
  const now = new Date();

  return [...events]
    .filter((e) => {
      const start = getItemDate(e);
      return start && start.getTime() > now.getTime();
    })
    .sort((a, b) => getItemDate(a) - getItemDate(b));
}, [events]);


  const toggleJoin = async (group) => {
    await toggleJoinDB(group);
  };

  const openEditMyGroup = (g) => {
    if (g.ownerId !== auth.currentUser?.uid) return;
    setSelectedGroup(g);
    setEditVisible(true);
  };

  const renderEventCard = ({ item }) => <EventCard item={item} theme={theme} />;

  const renderGroup = ({ item }) => {
    const isHighlighted = item.id === highlightId;

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => setDetailGroup(item)}>
        <GlassView
          glassEffectStyle="clear"
          intensity={isHighlighted ? 95 : 60}
          style={[
            styles.groupCard,
            {
              backgroundColor: isHighlighted
                ? theme.primary + "22"
                : theme.card,
              shadowColor: isHighlighted ? theme.primary : "#000",
              shadowOpacity: isHighlighted ? 0.35 : 0.08,
              shadowRadius: isHighlighted ? 18 : 8,
            },
          ]}
        >

          {item.image && <Image source={{ uri: item.image }} style={styles.groupCover} />}

          <View style={styles.groupBody}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>

              <View style={[styles.activityPill, { backgroundColor: theme.overlay }]}>
                <Ionicons name="flame" size={12} color={theme.accent} />
                <Text style={[styles.activityText, { color: theme.textPrimary }]}>
                  {item.activity || 0}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={14} color={theme.textMuted} />
                <Text style={[styles.metaText, { color: theme.textMuted }]}>
                  {item.members} members
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="pricetag-outline" size={14} color={theme.textMuted} />
                <Text style={[styles.metaText, { color: theme.textMuted }]}>
                  {item.category}
                </Text>
              </View>
            </View>

            <Text style={[styles.desc, { color: theme.textMuted }]} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.tagsRow}>
              {item.tags?.map((t, i) => (
                <View
                  key={`${item.id}-tag-${i}`}
                  style={[
                    styles.tag,
                    { borderColor: theme.border, backgroundColor: theme.overlay },
                  ]}
                >
                  <Text style={{ color: theme.textPrimary, fontSize: 11 }}>{t}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionsRow}>
              {item.ownerId !== auth.currentUser?.uid && (
                <FadeButton onPress={() => toggleJoin(item)}>
                  <View
                    style={[
                    styles.primaryBtn,
                    { backgroundColor: item.joined ? theme.danger : theme.primary },
                    ]}
                  >
                  <Ionicons
                    name={item.joined ? "log-out-outline" : "add"}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.primaryText}>
                    {item.joined ? "Leave" : "Join"}
                  </Text>
                  </View>
                </FadeButton>

              )}
            </View>
          </View>
        </GlassView>
      </TouchableOpacity>
    );
  };

    const mainView = (
      <>
        <View style={styles.headerRow}>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Groups</Text>

          <View style={{ flexDirection: "row" }}>
            {detailGroup?.ownerId === auth.currentUser?.uid && (
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={() => setCreateEventVisible(true)}
              >
                <Ionicons name="calendar-outline" size={22} color={theme.primary} />
              </TouchableOpacity>
            )}

            <FadeButton onPress={() => setCreateGroupVisible(true)}>
              <View style={styles.headerBtn}>
                <Ionicons name="add-circle-outline" size={22} color={theme.primary} />
              </View>
            </FadeButton>

          </View>
        </View>

        <GlassView
          intensity={60}
          style={[styles.filterHeader, { backgroundColor: theme.card }]}
        >
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
                {
                  backgroundColor: activeCat === cat ? theme.primary : theme.overlay,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={{
                  color: activeCat === cat ? "#fff" : theme.textPrimary,
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          ref={listRef}
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          onScrollToIndexFailed={(info) => {
            requestAnimationFrame(() => {
              listRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            });
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 16 }}
          ListHeaderComponent={
            <View>
              {upcomingEvents.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Upcoming Events
                  </Text>

                  <FlatList
                    data={upcomingEvents}
                    keyExtractor={(e) => e.id}
                    horizontal
                    renderItem={renderEventCard}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16 }}
                    style={{ marginBottom: 10 }}
                  />
                </>
              )}

              {myGroups.length > 0 && (
                <View style={{ marginTop: 6, marginBottom: 10 }}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    My Groups
                  </Text>

                  <FlatList
                    data={myGroups}
                    horizontal
                    keyExtractor={(g) => g.id}
                    renderItem={({ item: g }) => (
                      <TouchableOpacity onPress={() => openEditMyGroup(g)}>
                        <GlassView
                          glassEffectStyle="clear"
                          intensity={50}
                          style={[styles.miniCard, { backgroundColor: theme.card }]}
                        >
                          {g.image && (
                            <Image source={{ uri: g.image }} style={styles.miniCover} />
                          )}

                          <View style={{ padding: 10 }}>
                            <Text
                              style={[styles.miniTitle, { color: theme.textPrimary }]}
                              numberOfLines={1}
                            >
                              {g.name}
                            </Text>

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                              <Ionicons name="people-outline" size={12} color={theme.textMuted} />
                              <Text style={[styles.miniMeta, { color: theme.textMuted }]}>
                                {" "}
                                {g.members}
                              </Text>
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
          source={
            isDarkMode
              ? require("../../assets/backgrounds/dark.png")
              : require("../../assets/backgrounds/light.png")
          }
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
            onJoinToggle={() => toggleJoin(detailGroup)}
            onCreateEvent={() => setCreateEventVisible(true)}
          />
        )}

        {editVisible && selectedGroup && (
          <EditGroupModal
            visible={editVisible}
            onClose={() => setEditVisible(false)}
            group={selectedGroup}
          />
        )}

        {createGroupVisible && (
          <CreateGroupModal
            visible={createGroupVisible}
            onClose={() => setCreateGroupVisible(false)}
            onSave={(payload) => createGroupDB(payload)}
          />
        )}

        {createEventVisible && (
          <CreateEventModal
            visible={createEventVisible}
            onClose={() => setCreateEventVisible(false)}
            onSave={(payload) => createEventDB(payload)}

            groups={[
              { id: null, name: "No group" },
              ...groups
                .filter((g) => g.ownerId === auth.currentUser?.uid)
                .map((g) => ({ id: g.id, name: g.name }))
            ]}
          />
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: {
      marginTop: 45,
      paddingHorizontal: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    screenTitle: { fontSize: 24, fontWeight: "700" },
    headerBtn: { padding: 6, marginLeft: 8 },
    filterHeader: {
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 16,
      padding: 12,
      marginBottom: 10,
    },
    searchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    searchInput: { flex: 1, fontSize: 14 },
    categoriesWrap: { flexDirection: "row", flexWrap: "wrap", alignSelf: "center" },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 4,
      marginBottom: 8,
      borderWidth: 1,
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginHorizontal: 16, marginBottom: 8 },
    miniCard: { width: 170, borderRadius: 16, overflow: "hidden" },
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
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 6,
      borderWidth: 1,
    },
    actionsRow: { flexDirection: "row", marginTop: 12, justifyContent: "flex-end" },
    primaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    primaryText: { marginLeft: 8, color: "#fff", fontWeight: "700", fontSize: 14 },
  });
