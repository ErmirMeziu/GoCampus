import React, { useMemo, useRef, useState } from "react";
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
  Keyboard,
  Platform,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GlassView } from "expo-glass-effect";
import { pickImages } from "../utils/imageUtils";
import { addPoints } from "../firebase/points";
import { auth } from "../firebase/config";
import { useFadeModal } from "../animations/useFadeModal";

const pad2 = (n) => String(n).padStart(2, "0");
const toYYYYMMDD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const toHHMM = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

export default function CreateEventModal({ visible, onClose, onSave, groups = [] }) {
  const { overlayStyle, modalStyle } = useFadeModal(visible);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [groupId, setGroupId] = useState(groups?.[0]?.id ?? null);

  // ✅ real date/time
  const [eventDate, setEventDate] = useState(null); // Date object
  const [eventTime, setEventTime] = useState(null); // Date object

  // ✅ temp values for iOS wheel until user presses OK
  const [tempDate, setTempDate] = useState(null);
  const [tempTime, setTempTime] = useState(null);

  // ✅ require at least one photo
  const [image, setImage] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const translateY = useRef(new Animated.Value(40)).current;

  const canCreate = useMemo(() => {
    return !!title.trim() && !!eventDate && !!eventTime && !!image?.base64;
  }, [title, eventDate, eventTime, image]);

  const handlePickImage = async () => {
    const [img] = await pickImages(false);
    if (img) setImage(img);
  };

  const reset = () => {
    setTitle("");
    setLocation("");
    setGroupId(groups?.[0]?.id ?? null);
    setEventDate(null);
    setEventTime(null);
    setTempDate(null);
    setTempTime(null);
    setImage(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleCreate = () => {
    if (!canCreate) return;

    const now = new Date();

    onSave({
      title: title.trim(),
      // ✅ store consistent formats
      date: toYYYYMMDD(eventDate), // "YYYY-MM-DD"
      time: toHHMM(eventTime), // "HH:MM"
      location: location.trim(),
      groupId: groupId ?? null,
      imageBase64: image?.base64 || null,

      createdBy: auth.currentUser?.uid ?? null,
      createdAt: now.getTime(),
      dateCreated: now.toISOString(),
    });

    addPoints(auth.currentUser?.uid, "createEvent");
    reset();
    onClose?.();
  };

  const onCancel = () => {
    reset();
    onClose?.();
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onCancel}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
      />

      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[
                modalStyle,
                { transform: [...(modalStyle.transform || []), { translateY }] },
              ]}
            >
              <TouchableOpacity activeOpacity={1} onPress={() => {}}>
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

                    {/* ✅ Date + Time buttons */}
                    <View style={styles.row}>
                      <TouchableOpacity
                        style={[styles.pickerBtn, { flex: 1 }]}
                        onPress={() => {
                          setTempDate(eventDate || new Date());
                          setShowDatePicker(true);
                        }}
                      >
                        <Text style={styles.pickerText}>
                          {eventDate ? toYYYYMMDD(eventDate) : "Pick Date"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.pickerBtn, { flex: 1 }]}
                        onPress={() => {
                          setTempTime(eventTime || new Date());
                          setShowTimePicker(true);
                        }}
                      >
                        <Text style={styles.pickerText}>
                          {eventTime ? toHHMM(eventTime) : "Pick Time"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* ✅ iOS wheel with OK/Cancel */}
                    {showDatePicker && Platform.OS === "ios" && (
                      <View style={styles.pickerContainer}>
                        <DateTimePicker
                          value={tempDate || eventDate || new Date()}
                          mode="date"
                          display="spinner"
                          minimumDate={new Date()}
                          onChange={(e, selected) => {
                            if (selected) setTempDate(selected);
                          }}
                        />

                        <View style={styles.pickerActions}>
                          <TouchableOpacity
                            onPress={() => {
                              setTempDate(null);
                              setShowDatePicker(false);
                            }}
                          >
                            <Text style={styles.pickerActionText}>Cancel</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setEventDate(tempDate || eventDate || new Date());
                              setTempDate(null);
                              setShowDatePicker(false);
                            }}
                          >
                            <Text style={[styles.pickerActionText, { fontWeight: "700" }]}>
                              OK
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {showTimePicker && Platform.OS === "ios" && (
                      <View style={styles.pickerContainer}>
                        <DateTimePicker
                          value={tempTime || eventTime || new Date()}
                          mode="time"
                          is24Hour
                          display="spinner"
                          onChange={(e, selected) => {
                            if (selected) setTempTime(selected);
                          }}
                        />

                        <View style={styles.pickerActions}>
                          <TouchableOpacity
                            onPress={() => {
                              setTempTime(null);
                              setShowTimePicker(false);
                            }}
                          >
                            <Text style={styles.pickerActionText}>Cancel</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setEventTime(tempTime || eventTime || new Date());
                              setTempTime(null);
                              setShowTimePicker(false);
                            }}
                          >
                            <Text style={[styles.pickerActionText, { fontWeight: "700" }]}>
                              OK
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* ✅ Android native pickers (auto OK) */}
                    {showDatePicker && Platform.OS !== "ios" && (
                      <DateTimePicker
                        value={eventDate || new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={(e, selected) => {
                          setShowDatePicker(false);
                          if (selected) setEventDate(selected);
                        }}
                      />
                    )}

                    {showTimePicker && Platform.OS !== "ios" && (
                      <DateTimePicker
                        value={eventTime || new Date()}
                        mode="time"
                        is24Hour
                        display="default"
                        onChange={(e, selected) => {
                          setShowTimePicker(false);
                          if (selected) setEventTime(selected);
                        }}
                      />
                    )}

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

                    {/* ✅ Require image */}
                    <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                      <Text style={styles.imagePickerText}>
                        {image ? "Change Image" : "Pick Event Image (Required)"}
                      </Text>
                    </TouchableOpacity>

                    {image && (
                      <Image source={{ uri: image.uri }} style={styles.preview} />
                    )}

                    {!image && (
                      <Text style={styles.warnText}>
                        Please pick at least one photo to create the event.
                      </Text>
                    )}

                    <View style={styles.row}>
                      <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "rgba(255,255,255,0.25)" }]}
                        onPress={onCancel}
                      >
                        <Text style={styles.btnText}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.btn,
                          { backgroundColor: "#0072ff", opacity: canCreate ? 1 : 0.45 },
                        ]}
                        disabled={!canCreate}
                        onPress={handleCreate}
                      >
                        <Text style={styles.btnText}>Create</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </GlassView>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
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
  label: { color: "#fff", marginBottom: 6, fontWeight: "600" },
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
  warnText: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: -4, marginBottom: 10 },
  pickerBtn: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
  },
  pickerText: { color: "#fff", fontWeight: "600" },

  // ✅ iOS picker + OK/Cancel
  pickerContainer: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  pickerActionText: {
    color: "#fff",
    fontSize: 14,
  },
});
