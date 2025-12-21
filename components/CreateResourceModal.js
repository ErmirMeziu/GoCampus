import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
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
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { addPoints } from "../firebase/points";
import { auth } from "../firebase/config";
import { useFadeModal } from "../animations/useFadeModal";

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
    const { overlayStyle, modalStyle } = useFadeModal(visible);

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
        if (!picked?.length) return;
        setImages((prev) => [...prev, ...picked]);
    };

    const removeImage = (uri) =>
        setImages((prev) => prev.filter((img) => img.uri !== uri));

    const submit = () => {
        if (!title.trim()) return alert("⚠️ Please add a title.");
        if (!description.trim()) return alert("⚠️ Please add a description.");
        if (!images.length) return alert("⚠️ Upload at least one image.");

        let resourceData = {
            resourceType,
            title,
            description,
            images: images.map((img) => img.base64),
        };

        if (resourceType === "Equipment") {
            resourceData.condition = condition;
            resourceData.borrowDuration = borrowDuration;
        }

        onSave?.({
            id: initialData?.id ?? null,
            ...resourceData,
            createdBy: auth.currentUser?.uid ?? null,
            createdAt: Date.now(),
        });

        addPoints(auth.currentUser?.uid, "uploadResource");
        resetForm();
    };

    return (
        <Modal transparent visible={visible} onRequestClose={close}>

            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    styles.overlay,
                    overlayStyle,
                ]}
            />

            <TouchOutside activeOpacity={1} style={styles.overlay} onPress={close}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ width: "100%" }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                        <Animated.View style={modalStyle}>
                            <GlassView
                                style={[styles.sheet, { backgroundColor: theme.overlay }]}
                                intensity={95}
                            >
                                <View style={styles.header}>
                                    <Text style={[styles.title, { color: theme.textPrimary }]}>
                                        {editMode ? "Edit Resource" : "Create Resource"}
                                    </Text>
                                    <TouchableOpacity onPress={close}>
                                        <Ionicons name="close" size={24} color={theme.textPrimary} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>

                                    <View style={styles.typesRow}>
                                        {TYPES.map((t) => (
                                            <TouchableOpacity
                                                key={t}
                                                onPress={() => setResourceType(t)}
                                                style={[
                                                    styles.typeChip,
                                                    {
                                                        backgroundColor:
                                                            resourceType === t
                                                                ? theme.primary
                                                                : theme.card,
                                                        borderColor: theme.border,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        color:
                                                            resourceType === t
                                                                ? "#fff"
                                                                : theme.textPrimary,
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {t}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <Text style={[styles.label, { color: theme.textMuted }]}>Title</Text>
                                    <TextInput
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Enter title"
                                        placeholderTextColor={theme.textMuted}
                                        style={[
                                            styles.input,
                                            { color: theme.textPrimary, borderColor: theme.border },
                                        ]}
                                    />

                                    <Text style={[styles.label, { color: theme.textMuted }]}>Description</Text>
                                    <TextInput
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Describe your resource"
                                        placeholderTextColor={theme.textMuted}
                                        multiline
                                        style={[
                                            styles.input,
                                            {
                                                height: 100,
                                                textAlignVertical: "top",
                                                color: theme.textPrimary,
                                                borderColor: theme.border,
                                            },
                                        ]}
                                    />
                                    {resourceType === "Equipment" && (
                                        <>
                                            <Text style={[styles.label, { color: theme.textMuted }]}>Condition</Text>
                                            <TextInput
                                                value={condition}
                                                onChangeText={setCondition}
                                                placeholder="e.g. New / Good / Used"
                                                placeholderTextColor={theme.textMuted}
                                                style={[
                                                    styles.input,
                                                    { color: theme.textPrimary, borderColor: theme.border },
                                                ]}
                                            />

                                            <Text style={[styles.label, { color: theme.textMuted }]}>Borrow Duration (days)</Text>
                                            <TextInput
                                                value={borrowDuration}
                                                onChangeText={setBorrowDuration}
                                                placeholder="e.g. 3"
                                                placeholderTextColor={theme.textMuted}
                                                keyboardType="number-pad"
                                                style={[
                                                    styles.input,
                                                    { color: theme.textPrimary, borderColor: theme.border },
                                                ]}
                                            />
                                        </>
                                    )}


                                    <Text style={[styles.label, { color: theme.textMuted }]}>Images</Text>
                                    <TouchableOpacity
                                        style={[styles.imagePicker, { borderColor: theme.border }]}
                                        onPress={addImages}
                                    >
                                        <Ionicons name="images-outline" size={22} color={theme.textPrimary} />
                                        <Text style={{ marginLeft: 8, color: theme.textPrimary }}>
                                            Upload Images
                                        </Text>
                                    </TouchableOpacity>

                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {images.map((img, i) => (
                                            <View key={i} style={styles.previewWrap}>
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

                                    <View style={styles.row}>
                                        {editMode && (
                                            <TouchableOpacity
                                                style={[styles.btn, { backgroundColor: theme.danger }]}
                                                onPress={onDelete}
                                            >
                                                <Text style={styles.btnText}>Delete</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity
                                            style={[styles.btn, { backgroundColor: theme.card }]}
                                            onPress={close}
                                        >
                                            <Text style={[styles.btnText, { color: theme.textPrimary }]}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.btn, { backgroundColor: theme.primary }]}
                                            onPress={submit}
                                        >
                                            <Text style={styles.btnText}>
                                                {editMode ? "Save" : "Create"}
                                            </Text>
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
    overlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.35)", padding: 16, },
    sheet: { borderRadius: 18, padding: 16, maxHeight: "100%", },
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
    label: { fontSize: 12, marginVertical: 6 },
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
        marginBottom: 10,
    },
    previewWrap: { marginRight: 10, position: "relative" },
    previewImage: { width: 120, height: 90, borderRadius: 12 },
    removeBtn: { position: "absolute", top: -6, right: -6, backgroundColor: "#fff", borderRadius: 9 },
    row: { flexDirection: "row", gap: 8, marginTop: 14 },
    btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
    btnText: { color: "#fff", fontWeight: "700" },
});
