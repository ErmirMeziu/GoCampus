import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../context/ThemeProvider";
import CreateResourceModal from "../../components/CreateResourceModal";

// FIREBASE IMPORTS
import {
  listenAllResources,
  createResource,
  updateResource,
  deleteResource,
  getResourcesByType,
  getAllResources,
  searchResources,
} from "../../firebase/resources";

import { auth } from "../../firebase/config";

const CATEGORY_CHIPS = ["All", "Notes", "Books", "Equipment"];

export default function ResourceSharingScreen() {
  const { theme, isDarkMode } = useTheme();

  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  // MULTI IMAGE PICKER
  const pickImagesMulti = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (res?.canceled) return [];
    return (res?.assets || []).map((a) => a.uri);
  };

  // REAL-TIME FIREBASE LISTENER
  useEffect(() => {
    const unsub = listenAllResources((list) => {
      setResources(list);
    });

    return () => unsub();
  }, []);

  // CATEGORY FILTER — SERVER SIDE
  const handleCategoryChange = async (cat) => {
    setActiveCat(cat);

    if (cat === "All") {
      const all = await getAllResources();
      setResources(all);
    } else {
      const filtered = await getResourcesByType(cat);
      setResources(filtered);
    }
  };

  // SEARCH — SERVER SIDE
  const handleSearch = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResources(await getAllResources());
      return;
    }

    const results = await searchResources(text);
    setResources(results);
  };

  // CREATE RESOURCE — SAVE TO FIREBASE
  const handleCreate = async (payload) => {
    await createResource({
      ...payload,
      ownerId: auth.currentUser.uid,
      ownerName: auth.currentUser.displayName,
      ownerPhoto: auth.currentUser.photoURL,
    });

    setCreateVisible(false);
  };

  // UPDATE RESOURCE
  const handleEditSave = async (updated) => {
    await updateResource(updated.id, updated);
    setEditVisible(false);
    setEditTarget(null);
  };

  // DELETE RESOURCE
  const handleDeleteResource = async (id) => {
    await deleteResource(id);
    setEditVisible(false);
  };

  // 🔥 RENDER CARD (updated with owner photo + name)
  const renderCard = ({ item }) => (
    <GlassView
      glassEffectStyle="clear"
      intensity={60}
      style={[styles.card, { backgroundColor: theme.card }]}
    >
      <Image
        source={{
          uri:
            item.images?.[0] ||
            "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
        }}
        style={styles.cardImage}
      />

      <View style={styles.cardBody}>
        {/* HEADER: TITLE + OWNER CONTROLS */}
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.title}
          </Text>

          {/* SHOW EDIT + DELETE ONLY IF OWNER */}
          {item.ownerId === auth.currentUser.uid && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setEditTarget(item);
                  setEditVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={18} color={theme.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDeleteResource(item.id)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color={theme.danger || "red"} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* OWNER INFO */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          {item.ownerPhoto && (
            <Image
              source={{ uri: item.ownerPhoto }}
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                marginRight: 6,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            />
          )}
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
            {item.ownerName || "Unknown User"}
          </Text>
        </View>

        {/* DESCRIPTION */}
        <Text style={[styles.cardDesc, { color: theme.textMuted }]} numberOfLines={2}>
          {item.description}
        </Text>

        {/* EQUIPMENT INFO */}
        {item.resourceType === "Equipment" && (
          <Text style={[styles.cardInfo, { color: theme.textPrimary }]}>
            {item.condition} • {item.borrowDuration} days
          </Text>
        )}

        {/* IMAGE PREVIEW LIST */}
        {item.images?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {item.images.map((uri, idx) => (
              <Pressable key={idx} onPress={() => { setSelectedImage(uri); setImageModalVisible(true); }}>
                <Image source={{ uri }} style={styles.preview} />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </GlassView>
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
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Resources</Text>

        <TouchableOpacity onPress={() => setCreateVisible(true)}>
          <Ionicons style={{ padding: 6 }} name="add-circle-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <GlassView intensity={60} style={[styles.searchBar, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={16} color={theme.textMuted} />
        <TextInput
          placeholder="Search resources..."
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={handleSearch}
          style={[styles.searchInput, { color: theme.textPrimary }]}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </GlassView>

      {/* CATEGORY BUTTONS */}
      <View style={styles.categories}>
        {CATEGORY_CHIPS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => handleCategoryChange(c)}
            style={[
              styles.chip,
              {
                backgroundColor: activeCat === c ? theme.primary : theme.overlay,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={{
                color: activeCat === c ? "#fff" : theme.textPrimary,
                fontWeight: "600",
              }}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MAIN FEED LIST */}
      <FlatList
        data={resources}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 16 }}
      />

      {/* FULLSCREEN IMAGE VIEW */}
      <Modal visible={imageModalVisible} transparent onRequestClose={() => setImageModalVisible(false)}>
        <Pressable style={styles.lightbox} onPress={() => setImageModalVisible(false)}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: "100%", height: "80%" }} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>

      {/* CREATE MODAL */}
      {createVisible && (
        <CreateResourceModal
          visible
          onClose={() => setCreateVisible(false)}
          onSave={handleCreate}
          pickImages={pickImagesMulti}
          theme={theme}
        />
      )}

      {/* EDIT MODAL */}
      {editVisible && editTarget && (
        <CreateResourceModal
          visible
          editMode
          initialData={editTarget}
          onClose={() => setEditVisible(false)}
          onSave={handleEditSave}
          onDelete={() => handleDeleteResource(editTarget.id)}
          pickImages={pickImagesMulti}
          theme={theme}
        />
      )}
    </View>
  );
}

// STYLING REMAINS EXACTLY AS YOU SENT
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: 45, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, margin: 16, gap: 8, minHeight: 41, bottom: 4 },
  searchInput: { flex: 1, fontSize: 14 },
  categories: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 0, bottom: 5 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, marginBottom: 6, borderWidth: 1 },
  section: { fontSize: 16, fontWeight: "700", marginVertical: 8 },

  card: { borderRadius: 18, overflow: "hidden", marginBottom: 14 },
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardDesc: { fontSize: 13, marginTop: 6 },
  cardInfo: { fontSize: 12, marginTop: 4 },
  preview: { width: 110, height: 80, borderRadius: 12, marginRight: 8 },

  lightbox: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
});
