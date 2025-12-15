import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    TouchableOpacity as TouchOutside,
    Keyboard,
    Platform
} from "react-native";
import { GlassView } from "expo-glass-effect";
import { pickImages } from "../utils/imageUtils";
import { addPoints } from "../firebase/points";
import { auth } from "../firebase/config";

const CATEGORIES = ["Tech", "Arts", "Study", "Sports", "Social"];

export default function CreateGroupModal({ visible, onClose, onSave }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Tech");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState(null);

    const handlePickImage = async () => {
        const [img] = await pickImages(false);
        if (img) setImage(img);
    };

    const handleCreate = () => {
        if (!name.trim()) return;

        const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

        onSave({
            name: name.trim(),
            category,
            description: description.trim() || "Newly created group.",
            tags: tagList,
            imageBase64: image?.base64 || null,
            members: 1,
            joinedBy: [],
            createdBy: auth.currentUser?.uid ?? null,
            createdAt: Date.now(),
        });

        setName("");
        setCategory("Tech");
        setDescription("");
        setTags("");
        setImage(null);

        addPoints(auth.currentUser?.uid, "createGroup");
    };


    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>

            <TouchOutside
                activeOpacity={1}
                style={styles.overlay}
                onPress={onClose}
            >

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ width: "100%" }}
                >

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <GlassView style={styles.card} intensity={90}>

                            <Text style={styles.title}>Create Group</Text>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <TextInput
                                    placeholder="Group name"
                                    placeholderTextColor="#aaa"
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />

                                <View style={styles.chipsRow}>
                                    {CATEGORIES.map((c) => (
                                        <TouchableOpacity
                                            key={c}
                                            onPress={() => setCategory(c)}
                                            style={[
                                                styles.chip,
                                                {
                                                    backgroundColor:
                                                        category === c ? "#0072ff" : "rgba(255,255,255,0.15)"
                                                }
                                            ]}
                                        >
                                            <Text style={{ color: "#fff", fontWeight: "600" }}>{c}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TextInput
                                    placeholder="Description"
                                    placeholderTextColor="#aaa"
                                    style={[styles.input, { height: 90 }]}
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                />

                                <TextInput
                                    placeholder="Tags (comma separated)"
                                    placeholderTextColor="#aaa"
                                    style={styles.input}
                                    value={tags}
                                    onChangeText={setTags}
                                />

                                <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                                    <Text style={styles.imagePickerText}>
                                        {image ? "Change Cover Image" : "Pick Cover Image"}
                                    </Text>
                                </TouchableOpacity>

                                {image && (
                                    <Image source={{ uri: image.uri }} style={styles.preview} />
                                )}

                                <View style={styles.row}>
                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: "rgba(255,255,255,0.25)" }]}
                                        onPress={onClose}
                                    >
                                        <Text style={styles.btnText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.btn,
                                            { backgroundColor: "#0072ff", opacity: name.trim() ? 1 : 0.5 }
                                        ]}
                                        onPress={handleCreate}
                                        disabled={!name.trim()}
                                    >
                                        <Text style={styles.btnText}>Create</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                        </GlassView>
                    </TouchableWithoutFeedback>

                </KeyboardAvoidingView>

            </TouchOutside>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        padding: 16,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.35)"
    },
    card: {
        borderRadius: 18,
        padding: 16,
        maxHeight: "85%",
        bottom: 5
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        color: "#fff",
        textAlign: "center"
    },
    input: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        fontSize: 14,
        backgroundColor: "rgba(255,255,255,0.12)",
        color: "#fff"
    },
    chipsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8
    },
    row: { flexDirection: "row", gap: 10, marginTop: 6 },
    btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
    btnText: { fontWeight: "700", color: "#fff" },
    imagePicker: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10
    },
    imagePickerText: { color: "#fff", fontWeight: "600" },
    preview: {
        width: "100%",
        height: 160,
        borderRadius: 12,
        marginBottom: 10,
        marginTop: -2
    }
});