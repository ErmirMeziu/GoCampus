import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { GlassView } from "expo-glass-effect";

export default function CreateEventModal({ visible, onClose, onSave, groups = [], pickImage }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [groupId, setGroupId] = useState(groups?.[0]?.id ?? null);
    const [imageUri, setImageUri] = useState(null);

    const handlePickImage = async () => {
        const uri = await pickImage?.();
        if (uri) setImageUri(uri);
    };

    const handleCreate = () => {
        if (!title.trim() || !date.trim()) return;
        onSave({
            title: title.trim(),
            date: date.trim(),
            time: time.trim(),
            location: location.trim(),
            image: imageUri || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
            groupId: groupId ?? null,
        });
        setTitle(""); setDate(""); setTime(""); setLocation(""); setGroupId(groups?.[0]?.id ?? null); setImageUri(null);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <GlassView style={styles.card} intensity={90} >
                    <Text style={styles.title}>Create Event</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TextInput placeholder="Event Title" placeholderTextColor="#aaa" style={styles.input} value={title} onChangeText={setTitle} />
                        <View style={styles.row}>
                            <TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#aaa" style={[styles.input, { flex: 1 }]} value={date} onChangeText={setDate} />
                            <TextInput placeholder="HH:MM" placeholderTextColor="#aaa" style={[styles.input, { flex: 1 }]} value={time} onChangeText={setTime} />
                        </View>

                        <TextInput placeholder="Location" placeholderTextColor="#aaa" style={styles.input} value={location} onChangeText={setLocation} />

                        <Text style={styles.label}>Assign to Group</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                            {groups.map((g) => (
                                <TouchableOpacity
                                    key={g.id ?? "no-group"}
                                    onPress={() => setGroupId(g.id)}
                                    style={[
                                        styles.chip,
                                        { backgroundColor: groupId === g.id ? "#0072ff" : "rgba(255,255,255,0.15)" },
                                    ]}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>{g.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                            <Text style={styles.imagePickerText}>{imageUri ? "Change Event Image" : "Pick Event Image"}</Text>
                        </TouchableOpacity>

                        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

                        <View style={styles.row}>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: "rgba(255,255,255,0.25)" }]} onPress={onClose}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: "#0072ff", opacity: title.trim() ? 1 : 0.5 }]} onPress={handleCreate} disabled={!title.trim()}>
                                <Text style={styles.btnText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </GlassView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, padding: 16, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
    card: { borderRadius: 18, padding: 16, maxHeight: "85%" ,bottom:5},
    title: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#fff", textAlign: "center" },
    input: { borderRadius: 12, padding: 12, marginBottom: 10, fontSize: 14, backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" },
    label: { color: "#fff", marginBottom: 4, fontWeight: "600" },
    chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    row: { flexDirection: "row", gap: 10, marginTop: 6 },
    btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
    btnText: { fontWeight: "700", color: "#fff" },
    imagePicker: { backgroundColor: "rgba(255,255,255,0.2)", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 },
    imagePickerText: { color: "#fff", fontWeight: "600" },
    preview: { width: "100%", height: 160, borderRadius: 12, marginBottom: 10 },
});
