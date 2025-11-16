import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Modal,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    TouchableOpacity as TouchOutside,
    Keyboard,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { addPoints } from "../firebase/points";
import { auth } from "../firebase/config";

const TYPES = ["Notes", "Books", "Equipment"];

export default function CreateResourceModal({
    visible,
    onClose,
    onSave,
    onDelete,
    pickImages,
    theme,
    editMode = false,
    initialData = null,
}) {
    const [resourceType, setResourceType] = useState("Notes");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [condition, setCondition] = useState("Good");
    const [borrowDuration, setBorrowDuration] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (editMode && initialData) {
            setResourceType(initialData.resourceType || "Notes");
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setCondition(initialData.condition || "Good");
            setBorrowDuration(initialData.borrowDuration || "");

            setImages(
                (initialData.images || []).map((img) => ({
                    base64: img.base64 ?? img,
                    uri: img.uri ?? `data:image/jpeg;base64,${img}`,
                }))
            );
        } else {
            resetForm();
        }
    }, [editMode, initialData]);

    const resetForm = () => {
        setResourceType("Notes");
        setTitle("");
        setDescription("");
        setCondition("Good");
        setBorrowDuration("");
        setImages([]);
    };

    const close = () => {
        resetForm();
        onClose?.();
    };

    const addImages = async () => {
        const picked = await pickImages?.();
        if (!picked || picked.length === 0) return;
        setImages((prev) => [...prev, ...picked.filter(img => img?.base64 && img.base64.length > 10)]);
    };

    const removeImage = (uri) =>
        setImages((prev) => prev.filter((img) => img.uri !== uri));

    const submit = () => {
        if (!title.trim()) return alert("⚠️ Please add a title.");
        if (!description.trim()) return alert("⚠️ Please add a description.");
        if (images.length === 0) return alert("⚠️ Please upload at least one image.");

        if (resourceType === "Equipment") {
            const duration = parseInt(borrowDuration, 10);
            if (!duration || duration <= 0)
                return alert("⚠️ Borrow duration must be positive.");
        }

        let resourceData = {
            resourceType,
            title,
            description,
            images: images
                .map((img) => img.base64)
                .filter((b64) => typeof b64 === "string" && b64.length > 10),
        };

        if (resourceType === "Equipment") {
            resourceData.condition = condition;
            resourceData.borrowDuration = borrowDuration;
        }

        onSave?.({
            id: initialData?.id ?? null,
            ...resourceData,
        });
        addPoints(auth.currentUser?.uid, "uploadResource");

        resetForm();
    };

    const confirmDelete = () => {
        if (!onDelete) return;
        if (window?.confirm) {
            if (window.confirm("Delete this resource?")) onDelete();
        } else {
            onDelete();
        }
    };

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={close}>
            <TouchOutside
                activeOpacity={1}
                style={styles.overlay}
                onPress={close}
            >

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ width: "100%" }}
                >

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <GlassView style={[styles.sheet, { backgroundColor: theme.overlay }]} intensity={95}>

                            <View style={styles.header}>
                                <Text style={[styles.title, { color: theme.textPrimary }]}>
                                    {editMode ? "Edit Resource" : "Create Resource"}
                                </Text>
                                <TouchableOpacity onPress={close}>
                                    <Ionicons name="close" size={24} color={theme.textPrimary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.typesRow}>
                                {TYPES.map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        onPress={() => setResourceType(t)}
                                        style={[
                                            styles.typeChip,
                                            {
                                                backgroundColor:
                                                    resourceType === t ? theme.primary : theme.card,
                                                borderColor: theme.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color: resourceType === t ? "#fff" : theme.textPrimary,
                                                fontWeight: "700",
                                            }}
                                        >
                                            {t}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 16 }}
                            >
                                <Text style={[styles.label, { color: theme.textMuted }]}>Title</Text>
                                <TextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder={`Enter ${resourceType.toLowerCase()} title`}
                                    placeholderTextColor={theme.textMuted}
                                    style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                                />

                                <Text style={[styles.label, { color: theme.textMuted }]}>Description</Text>
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Describe your resource..."
                                    placeholderTextColor={theme.textMuted}
                                    multiline
                                    style={[
                                        styles.input,
                                        {
                                            color: theme.textPrimary,
                                            borderColor: theme.border,
                                            height: 100,
                                            textAlignVertical: "top",
                                        },
                                    ]}
                                />

                                {resourceType === "Equipment" && (
                                    <>
                                        <Text style={[styles.label, { color: theme.textMuted }]}>Condition</Text>
                                        <View style={styles.typesRow}>
                                            {["New", "Good", "Used"].map((c) => (
                                                <TouchableOpacity
                                                    key={c}
                                                    onPress={() => setCondition(c)}
                                                    style={[
                                                        styles.typeChip,
                                                        {
                                                            backgroundColor:
                                                                condition === c ? theme.primary : theme.card,
                                                            borderColor: theme.border,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            color:
                                                                condition === c ? "#fff" : theme.textPrimary,
                                                            fontWeight: "700",
                                                        }}
                                                    >
                                                        {c}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        <Text style={[styles.label, { color: theme.textMuted }]}>
                                            Max Borrow Duration (days)
                                        </Text>
                                        <TextInput
                                            placeholder="e.g. 3"
                                            placeholderTextColor={theme.textMuted}
                                            keyboardType="numeric"
                                            value={borrowDuration}
                                            onChangeText={setBorrowDuration}
                                            style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
                                        />
                                    </>
                                )}

                                <Text style={[styles.label, { color: theme.textMuted }]}>Images</Text>
                                <TouchableOpacity
                                    style={[styles.imagePicker, { borderColor: theme.border }]}
                                    onPress={addImages}
                                >
                                    <Ionicons name="images-outline" size={22} color={theme.textPrimary} />
                                    <Text style={{ marginLeft: 8, color: theme.textPrimary, fontWeight: "600" }}>
                                        {images.length > 0
                                            ? `Selected ${images.length} image(s)`
                                            : "Upload Images"}
                                    </Text>
                                </TouchableOpacity>

                                {images.length > 0 && images[0]?.base64 && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginTop: 10 }}
                                    >
                                        {images.map((img, idx) => (
                                            <View key={idx} style={styles.previewWrap}>
                                                <Image
                                                    source={{ uri: `data:image/jpeg;base64,${img.base64}` }}
                                                    style={styles.previewImage}
                                                />
                                                <TouchableOpacity
                                                    style={styles.removeBtn}
                                                    onPress={() => removeImage(img.uri)}
                                                >
                                                    <Ionicons name="close-circle" size={18} color="#ff4444" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}

                                <View style={styles.row}>
                                    {editMode && (
                                        <TouchableOpacity
                                            style={[styles.btn, { backgroundColor: theme.danger || "#cc4444" }]}
                                            onPress={confirmDelete}
                                        >
                                            <Text style={[styles.btnText, { color: "#fff" }]}>Delete</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: theme.card }]}
                                        onPress={close}
                                    >
                                        <Text style={[styles.btnText, { color: theme.textPrimary }]}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: theme.primary }]}
                                        onPress={submit}
                                    >
                                        <Text style={[styles.btnText, { color: "#fff" }]}>
                                            {editMode ? "Save Changes" : "Create"}
                                        </Text>
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
    overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
    sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: "92%" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    title: { fontSize: 18, fontWeight: "700" },
    typesRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 8 },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    label: { fontSize: 12, marginTop: 6, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    imagePicker: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    previewWrap: { marginRight: 10, position: "relative" },
    previewImage: { width: 120, height: 90, borderRadius: 12 },
    removeBtn: { position: "absolute", top: -6, right: -6, backgroundColor: "#fff", borderRadius: 9 },
    row: { flexDirection: "row", gap: 8, marginTop: 14 },
    btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
    btnText: { fontWeight: "700" },
});