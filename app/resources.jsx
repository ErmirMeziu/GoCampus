import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

export default function ResourceSharingScreen() {
  const [activeTab, setActiveTab] = useState("list");
  const [myResources, setMyResources] = useState([]);
  const [sharedResources, setSharedResources] = useState([
    {
      id: 1,
      resourceType: "Notes",
      title: "Physics Lecture Notes",
      description: "Chapter 1-3 summaries",
      images: [],
    },
    {
      id: 2,
      resourceType: "Equipment",
      title: "Lab Microscope",
      description: "Available for 3 days",
      condition: "Good",
      borrowDuration: "3",
      images: [],
    },
  ]);

  const [resourceType, setResourceType] = useState("Notes");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Good");
  const [borrowDuration, setBorrowDuration] = useState("");
  const [images, setImages] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listType, setListType] = useState("myShares");
  const [dropdownItems, setDropdownItems] = useState([
    { label: "My Shares", value: "myShares" },
    { label: "Shared by Others", value: "others" },
  ]);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newUris]);
    }
  };

  const removeImage = (uri) => {
    setImages((prev) => prev.filter((i) => i !== uri));
  };

  const handleSubmit = () => {
     if (!title.trim()) {
      alert("⚠️ Please add a title.");
      return;
    }
    if (!description.trim()) {
      alert("⚠️ Please add a description.");
      return;
    }
    if (resourceType === "Equipment") {
      if (images.length === 0) {
        alert("⚠️ Please upload at least one image for Equipment.");
        return;
      }
      const duration = parseInt(borrowDuration);
      if (!duration || duration <= 0) {
        alert("⚠️ Borrow duration must be a positive number.");
        return;
      }
    }

    const newResource = {
      id: Date.now(),
      resourceType,
      title,
      description,
      condition: resourceType === "Equipment" ? condition : undefined,
      borrowDuration: resourceType === "Equipment" ? borrowDuration : undefined,
      images,
    };

    setMyResources((prev) => [newResource, ...prev]);
    setActiveTab("list");
    setListType("myShares");

    setTitle("");
    setDescription("");
    setCondition("Good");
    setBorrowDuration("");
    setImages([]);
  };

  const renderResourceCard = (resource) => (
    <View key={resource.id} style={styles.card}>
      <Text style={styles.cardTitle}>
        {resource.title} ({resource.resourceType})
      </Text>
      <Text style={styles.cardDesc}>{resource.description}</Text>
      {resource.condition && (
        <Text style={styles.cardInfo}>Condition: {resource.condition}</Text>
      )}
      {resource.borrowDuration && (
        <Text style={styles.cardInfo}>
          Max Borrow Duration: {resource.borrowDuration} days
        </Text>
      )}
      {resource.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
          {resource.images.map((uri, idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                setSelectedImage(uri);
                setImageModalVisible(true);
              }}
            >
              <Image source={{ uri }} style={styles.previewImage} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={["#f5f7fa", "#c3cfe2"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.topBar}>
        <DropDownPicker
          open={dropdownOpen}
          value={listType}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setListType}
          setItems={setDropdownItems}
          containerStyle={{ flex: 1, marginRight: 10, zIndex: 1000 }}
          style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          dropDownContainerStyle={{ backgroundColor: "rgba(255,255,255,0.95)", zIndex: 1000 }}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setActiveTab("add")}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {activeTab === "list" && (
        <ScrollView style={{ flex: 1, padding: 10 }} showsVerticalScrollIndicator={false}>
          {listType === "myShares"
            ? myResources.length === 0
              ? <Text style={{ textAlign: "center", marginTop: 50, color: "#333" }}>You haven’t shared anything yet.</Text>
              : myResources.map(renderResourceCard)
            : sharedResources.map(renderResourceCard)}
        </ScrollView>
      )}

      {activeTab === "add" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
            <BlurView intensity={90} tint="light" style={styles.form}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setActiveTab("list");
                  setListType("myShares");
                  setTitle("");
                  setDescription("");
                  setCondition("Good");
                  setBorrowDuration("");
                  setImages([]);
                }}
              >
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>

              <Text style={styles.label}>Resource Type</Text>
              <View style={styles.typeSelector}>
                {["Notes", "Equipment", "Books"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeButton, resourceType === type && styles.typeButtonActive]}
                    onPress={() => setResourceType(type)}
                  >
                    <Text style={[styles.typeButtonText, resourceType === type && styles.typeButtonTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${resourceType.toLowerCase()} title`}
                value={title}
                onChangeText={setTitle}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Describe your resource..."
                value={description}
                onChangeText={setDescription}
                multiline
              />

               {resourceType === "Equipment" && (
                <>
                  <Text style={styles.label}>Condition</Text>
                  <View style={styles.typeSelector}>
                    {["New", "Good", "Used"].map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.typeButton, condition === c && styles.typeButtonActive]}
                        onPress={() => setCondition(c)}
                      >
                        <Text style={[styles.typeButtonText, condition === c && styles.typeButtonTextActive]}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Max Borrow Duration (days)</Text>
                  <TextInput
                    placeholder="e.g. 3"
                    keyboardType="numeric"
                    style={styles.input}
                    value={borrowDuration}
                    onChangeText={setBorrowDuration}
                  />
                </>
              )}

              <Text style={styles.label}>Images</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
                <Ionicons name="images-outline" size={26} color="#333" />
                <Text style={styles.imagePickerText}>
                  {images.length > 0 ? `Selected ${images.length} image(s)` : "Upload Images"}
                </Text>
              </TouchableOpacity>

          
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 50 : 20,
    marginHorizontal: 10,
    zIndex: 1000,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0072ff",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 10,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 4,
    zIndex: 100,
  },
  label: { fontWeight: "600", marginTop: 10, marginBottom: 6, color: "#333" },
  input: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  typeSelector: { flexDirection: "row", marginVertical: 6 },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginRight: 8,
    alignItems: "center",
  },
  typeButtonActive: { backgroundColor: "#0072ff" },
  typeButtonText: { color: "#333", fontWeight: "500" },
  typeButtonTextActive: { color: "#fff", fontWeight: "700" },
  imagePicker: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 16,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  imagePickerText: { color: "#333", marginTop: 8, fontWeight: "500" },
  imageWrapper: { marginRight: 10, position: "relative" },
  previewImage: { width: 120, height: 120, borderRadius: 14 },
  removeBtn: { position: "absolute", top: -6, right: -6, backgroundColor: "#fff", borderRadius: 10 },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#0072ff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 18 },
  card: { backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 16, padding: 12, marginVertical: 6 },
  cardTitle: { fontWeight: "700", fontSize: 16, color: "#0072ff" },
  cardDesc: { fontSize: 14, marginTop: 4, color: "#333" },
  cardInfo: { fontSize: 12, color: "#555", marginTop: 2 },
});