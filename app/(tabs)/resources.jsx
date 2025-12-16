import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { Alert } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { GlassView } from "expo-glass-effect";
import { useTheme } from "../../context/ThemeProvider";
import { useLocalSearchParams } from "expo-router";

import { pickImages, restoreImages, cleanData } from "../../utils/imageUtils";
import CreateResourceModal from "../../components/CreateResourceModal";
import FadeButton from "../../components/FadeButton";

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
  const { scrollTo } = useLocalSearchParams();

  const listRef = useRef(null);

  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [highlightId, setHighlightId] = useState(null);

  const confirmDeleteResource = (resource) => {
    Alert.alert(
      "Delete Resource",
      `Are you sure you want to delete "${resource.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteResource(resource.id),
        },
      ],
      { cancelable: true }
    );
  };



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const pickImagesMulti = () => pickImages(true);

  useEffect(() => {
    const unsub = listenAllResources((list) =>
      setResources(list.map((i) => ({ ...i, images: restoreImages(i.images) })))
    );
    return () => unsub();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQuery("");
        setActiveCat("All");
        setHighlightId(null);
        setResources(prev => prev);
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: false });
        });
      };
    }, [])
  );

  useEffect(() => {
    if (!scrollTo || !listRef.current || resources.length === 0) return;

    const index = resources.findIndex((r) => r.id === scrollTo);
    if (index >= 0) {
      setTimeout(() => {
        listRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.45,
        });
        setHighlightId(scrollTo);
        setTimeout(() => setHighlightId(null), 2000);
      }, 350);
    }
  }, [scrollTo, resources]);

  const clearSearchAndFocusAll = () => {
    setQuery("");
    setActiveCat("All");

    setHighlightId(null);

    listRef.current?.scrollToOffset({ offset: 0, animated: true });

    setTimeout(() => {
      setHighlightId(null);
    }, 0);
  };


  const handleCategoryChange = async (cat) => {
    setActiveCat(cat);
    const data =
      cat === "All" ? await getAllResources() : await getResourcesByType(cat);
    setResources(data.map((r) => ({ ...r, images: restoreImages(r.images) })));
  };

  const handleSearch = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      handleCategoryChange(activeCat);
      return;
    }

    const results = await searchResources(text);
    setResources(results.map((r) => ({ ...r, images: restoreImages(r.images) })));
  };

  const handleCreate = async (data) => {
    let safe = cleanData({
      ...data,
      images: Array.isArray(data.images) ? data.images : [],
      ownerId: auth.currentUser?.uid ?? "unknown",
      ownerName: auth.currentUser?.displayName ?? "Unknown User",
      ownerPhoto: auth.currentUser?.photoURL ?? null,
    });

    await createResource(safe);
    setCreateVisible(false);
  };

  const handleEditSave = async (updated) => {
    let safe = cleanData({
      ...updated,
      images: Array.isArray(updated.images) ? updated.images : [],
    });

    await updateResource(updated.id, safe);
    setEditVisible(false);
    setEditTarget(null);
  };

  const handleDeleteResource = async (id) => {
    await deleteResource(id);
    setEditVisible(false);
  };

  const renderCard = ({ item }) => {
    const isHighlighted = item.id === highlightId;

    return (
      <GlassView
        glassEffectStyle="clear"
        intensity={isHighlighted ? 95 : 60}
        style={[
          styles.card,
          {
            backgroundColor: isHighlighted ? theme.primary + "22" : theme.card,
            shadowColor: isHighlighted ? theme.primary : "#000",
            shadowOpacity: isHighlighted ? 0.35 : 0.08,
            shadowRadius: isHighlighted ? 18 : 8,
          },
        ]}
      >

        <Image
          source={
            item.images?.length
              ? { uri: item.images[0].uri }
              : {
                uri: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
              }
          }
          style={styles.cardImage}
        />

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              {item.title}
            </Text>

            {item.ownerId === auth.currentUser.uid && (
              <View style={{ flexDirection: "row" }}>
                <FadeButton
                  onPress={() => {
                    setEditTarget(item);
                    setEditVisible(true);
                  }}
                >
                  <Ionicons name="create-outline" size={18} color={theme.primary} />
                </FadeButton>   
                
                <FadeButton onPress={() => confirmDeleteResource(item)}>
                  <Ionicons name="trash-outline" size={18} color="red" />
                </FadeButton>
              </View>
            )}
          </View>

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
              {item.ownerName}
            </Text>
          </View>

          <Text
            style={[styles.cardDesc, { color: theme.textMuted }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {item.resourceType === "Equipment" && (
            <Text style={[styles.cardInfo, { color: theme.textPrimary }]}>
              {item.condition} • {item.borrowDuration} days
            </Text>
          )}

          {item.images?.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.images.map((img, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    setSelectedImage(img.uri);
                    setImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri: img.uri }} style={styles.preview} />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </GlassView>
    );
  };

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

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Resources</Text>

        <FadeButton onPress={() => setCreateVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
        </FadeButton>
      </View>

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
          <TouchableOpacity onPress={clearSearchAndFocusAll}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}

      </GlassView>

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

      <FlatList
        ref={listRef}
        data={resources}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 16 }}
        onScrollToIndexFailed={() => { }}
      />

      <Modal visible={imageModalVisible} transparent>
        <Pressable
          style={styles.lightbox}
          onPress={() => setImageModalVisible(false)}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "80%" }}
              resizeMode="contain"
            />
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
          onDelete={() => handleDeleteResource(editTarget.id)}
          pickImages={pickImagesMulti}
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginTop: 45,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
    gap: 8,
    minHeight: 41,
  },
  searchInput: { flex: 1, fontSize: 14 },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 6,
    borderWidth: 1,
  },
  card: { borderRadius: 18, overflow: "hidden", marginBottom: 14 },
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardDesc: { fontSize: 13, marginTop: 6 },
  cardInfo: { fontSize: 12, marginTop: 4 },
  preview: { width: 110, height: 80, borderRadius: 12, marginRight: 8 },
  lightbox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
}); 