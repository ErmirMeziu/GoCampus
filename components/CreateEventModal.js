import React, { useState, useRef } from "react";
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
    Platform,
    Animated,
} from "react-native";
import { GlassView } from "expo-glass-effect";
import { pickImages } from "../utils/imageUtils";
import { addPoints } from "../firebase/points";
import { auth } from "../firebase/config";
import { useFadeModal } from "../animations/useFadeModal";

export default function CreateEventModal({ visible, onClose, onSave, groups = [] }) {
    const { overlayStyle, modalStyle } = useFadeModal(visible);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [groupId, setGroupId] = useState(groups?.[0]?.id ?? null);
    const [image, setImage] = useState(null);

    const translateY = useRef(new Animated.Value(40)).current;

    const handlePickImage = async () => {
        const [img] = await pickImages(false);
        if (img) setImage(img);
    };

    const handleCreate = () => {
        if (!title.trim() || !date.trim()) return;

        const now = new Date();

        onSave({
            title: title.trim(),
            date: date.trim(),
            time: time.trim(),
            location: location.trim(),
            groupId: groupId ?? null,
            imageBase64: image?.base64 || null,
            createdBy: auth.currentUser?.uid ?? null,
            createdAt: now.getTime(),
            dateCreated: now.toISOString(),
        });

        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setGroupId(groups?.[0]?.id ?? null);
        setImage(null);

        addPoints(auth.currentUser?.uid, "createEvent");
    };

    return (
        <Modal transparent visible={visible} onRequestClose={onClose}>
            
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    styles.overlay,
                    overlayStyle,
                ]}
            />

            <TouchOutside activeOpacity={1} style={styles.overlay} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ width: "100%" }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Animated.View
                            style={[
                                modalStyle, 
                                { transform: [...modalStyle.transform, { translateY }] },
                            ]}
                        >
                            <GlassView style={styles.card} intensity={90}>
                                <Text style={styles.title}>Create Event</Text>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <TextInput
                                        placeholder="Event Title"
                                        placeholderTextColor="#aaa"
                                        style={styles.input}
                                        value={title}
                                        onChangeText={setTitle}
                                    />

                                    <View style={styles.row}>
                                        <TextInput
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor="#aaa"
                                            style={[styles.input, { flex: 1 }]}
                                            value={date}
                                            onChangeText={setDate}
                                        />
                                        <TextInput
                                            placeholder="HH:MM"
                                            placeholderTextColor="#aaa"
                                            style={[styles.input, { flex: 1 }]}
                                            value={time}
                                            onChangeText={setTime}
                                        />
                                    </View>

                                    <TextInput
                                        placeholder="Location"
                                        placeholderTextColor="#aaa"
                                        style={styles.input}
                                        value={location}
                                        onChangeText={setLocation}
                                    />

                                    <Text style={styles.label}>Assign to Group</Text>

                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {groups.map((g) => (
                                            <TouchableOpacity
                                                key={g.id ?? "nogroup"}
                                                onPress={() => setGroupId(g.id)}
                                                style={[
                                                    styles.chip,
                                                    {
                                                        backgroundColor:
                                                            g.id === groupId
                                                                ? "#0072ff"
                                                                : "rgba(255,255,255,0.15)",
                                                    },
                                                ]}
                                            >
                                                <Text style={{ color: "#fff" }}>{g.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={styles.imagePicker}
                                        onPress={handlePickImage}
                                    >
                                        <Text style={styles.imagePickerText}>
                                            {image ? "Change Image" : "Pick Event Image"}
                                        </Text>
                                    </TouchableOpacity>

                                    {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

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
                                                { backgroundColor: "#0072ff", opacity: title.trim() ? 1 : 0.5 },
                                            ]}
                                            disabled={!title.trim()}
                                            onPress={handleCreate}
                                        >
                                            <Text style={styles.btnText}>Create</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </GlassView>
                        </Animated.View>
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
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    card: {
        borderRadius: 18,
        padding: 16,
        maxHeight: "100%",
        maxWidth: "100%",

        bottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        color: "#fff",
        textAlign: "center",
    },
    input: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "rgba(255,255,255,0.12)",
        color: "#fff",
    },
    label: { color: "#fff", marginBottom: 4, fontWeight: "600" },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 10,
    },
    imagePicker: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    imagePickerText: { color: "#fff", fontWeight: "600" },
    preview: { width: "100%", height: 160, borderRadius: 12, marginBottom: 10 },
    row: { flexDirection: "row", gap: 10 },
    btn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    btnText: { color: "#fff", fontWeight: "700" },
});
