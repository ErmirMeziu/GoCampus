import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView
} from "react-native";
import { GlassView } from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";
import { updateGroupDB, deleteGroupDB } from "../firebase/groups";

export default function EditGroupModal({ visible, onClose, group }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDesc(group.description);
      setTags(group.tags?.join(", ") || "");
    }
  }, [group]);

  if (!group) return null;

  const handleSave = async () => {
    const updatedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);

    await updateGroupDB(group.id, {
      name: name.trim(),
      description: desc.trim(),
      tags: updatedTags,
    });

    onClose();
  };

  const handleDelete = async () => {
    await deleteGroupDB(group.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <GlassView style={styles.modal} intensity={90}>
          <Text style={styles.title}>Edit Group</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Group name"
              placeholderTextColor="#aaa"
              style={styles.input}
            />

            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Description"
              placeholderTextColor="#aaa"
              style={[styles.input, { height: 100 }]}
              multiline
            />

            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="Tags (comma separated)"
              placeholderTextColor="#aaa"
              style={styles.input}
            />

            <View style={styles.tagPreview}>
              {tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t, i) => (
                  <View key={i} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{t}</Text>
                  </View>
                ))}
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancel} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.save} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteText}>Delete Group</Text>
            </TouchableOpacity>
          </ScrollView>
        </GlassView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modal: { width: "88%", borderRadius: 22, padding: 20, maxHeight: "80%" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#fff", textAlign: "center" },
  input: { backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 14 },
  tagPreview: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, marginBottom: 10 },
  tagChip: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, margin: 4 },
  tagText: { color: "#fff", fontSize: 12 },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancel: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 10, width: "45%", alignItems: "center" },
  cancelText: { color: "#fff", fontWeight: "600" },
  save: { backgroundColor: "#0072ff", borderRadius: 10, padding: 10, width: "45%", alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
  deleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#e63946", marginTop: 18, padding: 12, borderRadius: 10 },
  deleteText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
});