import React, { useMemo, useState, useCallback } from "react";
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
import { useTheme } from "../context/ThemeProvider";

import CreateResourceModal from "../components/CreateResourceModal";

const CATEGORY_CHIPS = ["All", "Notes", "Books", "Equipment"];

const SEED_SHARED = [
  {
    id: "r2",
    resourceType: "Equipment",
    title: "Lab Microscope",
    description: "Available for 3 days.",
    condition: "Good",
    borrowDuration: "3",
    images: [
      "https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&q=80",
    ],
    owner: "others",
  },
];

export default function ResourceSharingScreen() {
  const { theme, isDarkMode } = useTheme();

  const [myResources, setMyResources] = useState([]);
  const [sharedResources, setSharedResources] = useState(SEED_SHARED);

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

  const pickImagesMulti = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (res?.canceled) return [];
    return (res?.assets || []).map((a) => a.uri);
  };

  const allResources = useMemo(() => {
    const combined = [
      ...myResources.map((r) => ({ ...r, owner: "me" })),
      ...sharedResources,
    ];
    const q = query.trim().toLowerCase();
    return combined.filter((r) => {
      const catOk = activeCat === "All" || r.resourceType === activeCat;
      const qOk =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [myResources, sharedResources, query, activeCat]);

  const myCarousel = useMemo(() => myResources, [myResources]);

  const handleCreate = (payload) => {
    const res = { id: `r${Date.now()}`, ...payload, owner: "me" };
    setMyResources((prev) => [res, ...prev]);
    setCreateVisible(false);
  };

  const handleEditSave = (updated) => {
    setMyResources((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditVisible(false);
    setEditTarget(null);
  };

  const handleDelete = (id) => {
    setMyResources((prev) => prev.filter((r) => r.id !== id));
    setEditVisible(false);
  };

  const renderMyMini = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setEditTarget(item);
        setEditVisible(true);
      }}
    >
      <GlassView
        glassEffectStyle="clear"
        intensity={50}
        style={[styles.miniCard, { backgroundColor: theme.card }]}
      >
        <Image
          source={{
            uri:
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1505666287802-931dc83948e1?w=800&q=80",
          }}
          style={styles.miniCover}
        />
        <View style={{ padding: 10 }}>
          <Text style={[styles.miniTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <Ionicons name="pricetag-outline" size={12} color={theme.textMuted} />
            <Text style={[styles.miniMeta, { color: theme.textMuted }]}>
              {" "}
              {item.resourceType}
            </Text>
          </View>
        </View>
      </GlassView>
    </TouchableOpacity>
  );

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
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.title}
          </Text>
          {item.owner === "me" && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setEditTarget(item);
                  setEditVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={18} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 8 }}>
                <Ionicons name="trash-outline" size={18} color={theme.danger || "red"} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={[styles.cardDesc, { color: theme.textMuted }]} numberOfLines={2}>
          {item.description}
        </Text>

        {item.resourceType === "Equipment" && (
          <Text style={[styles.cardInfo, { color: theme.textPrimary }]}>
            {item.condition} • {item.borrowDuration} days
          </Text>
        )}

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
            ? require("../assets/backgrounds/dark.png")
            : require("../assets/backgrounds/light.png")
        }
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Resources</Text>
        <TouchableOpacity onPress={() => setCreateVisible(true)}>
          <Ionicons style={{padding:6,}} name="add-circle-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <GlassView intensity={60} style={[styles.searchBar, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={16} color={theme.textMuted} />
        <TextInput
          placeholder="Search resources..."
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { color: theme.textPrimary }]}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </GlassView>

      <View style={styles.categories}>
        {CATEGORY_CHIPS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setActiveCat(c)}
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

      <FlatList
        data={allResources}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 16 }}
        ListHeaderComponent={
          myCarousel.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.section, { color: theme.textPrimary }]}>My Resources</Text>
              <FlatList
                horizontal
                data={myCarousel}
                keyExtractor={(i) => i.id}
                renderItem={renderMyMini}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              />
              <Text style={[styles.section, { color: theme.textPrimary }]}>All Resources</Text>
            </View>
          )
        }
      />

      <Modal visible={imageModalVisible} transparent onRequestClose={() => setImageModalVisible(false)}>
        <Pressable style={styles.lightbox} onPress={() => setImageModalVisible(false)}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: "100%", height: "80%" }} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>

      {createVisible && (
        <CreateResourceModal
          visible
          onClose={() => setCreateVisible(false)}
          onSave={handleCreate}
          pickImages={pickImagesMulti}
          theme={theme}
        />
      )}
      {editVisible && editTarget && (
        <CreateResourceModal
          visible
          editMode
          initialData={editTarget}
          onClose={() => setEditVisible(false)}
          onSave={handleEditSave}
          onDelete={() => handleDelete(editTarget.id)}
          pickImages={pickImagesMulti}
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { marginTop: 45,paddingHorizontal: 16,flexDirection: "row",justifyContent: "space-between",alignItems: "center",},
  title: { fontSize: 24, fontWeight: "700" },
  searchBar: {flexDirection: "row",alignItems: "center", borderRadius: 16,paddingHorizontal: 12,paddingVertical: 10,margin: 16,gap: 8,minHeight:41,bottom:4,},
  searchInput: { flex: 1, fontSize: 14},
  categories: {flexDirection: "row",flexWrap: "wrap",justifyContent: "center",marginBottom: 0,bottom:5, },
  chip: {paddingHorizontal: 12,paddingVertical: 8,borderRadius: 20,marginHorizontal: 4,marginBottom: 6,borderWidth: 1,},
  section: { fontSize: 16, fontWeight: "700", marginVertical: 8 },

  miniCard: { width: 160, borderRadius: 16, overflow: "hidden", marginRight: 12 },
  miniCover: { width: "100%", height: 86 },
  miniTitle: { fontSize: 13, fontWeight: "700" },
  miniMeta: { fontSize: 11 },

  card: { borderRadius: 18, overflow: "hidden", marginBottom: 14 },
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardDesc: { fontSize: 13, marginTop: 6 },
  cardInfo: { fontSize: 12, marginTop: 4 },
  preview: { width: 110, height: 80, borderRadius: 12, marginRight: 8 },

  lightbox: {flex: 1, backgroundColor: "rgba(0,0,0,0.9)",justifyContent: "center", alignItems: "center",},
});