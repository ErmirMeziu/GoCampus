import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { askGPT } from "../../utils/gpt";
import { useTheme } from "../../context/ThemeProvider";

export default function NotesAI() {
  const { theme } = useTheme();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [activeMode, setActiveMode] = useState("summary");

  const modes = [
    { id: "summary", icon: "sparkles-outline", label: "Summarize" },
    { id: "flashcards", icon: "albums-outline", label: "Flashcards" },
    { id: "quiz", icon: "help-circle-outline", label: "Quiz" },
    { id: "explain5", icon: "happy-outline", label: "Explain 5yo" },
    { id: "translate", icon: "globe-outline", label: "Translate" },
  ];

  async function generate(type) {
    if (!text.trim()) {
      alert("Please enter some notes.");
      return;
    }

    setActiveMode(type);
    setLoading(true);

    let prompt = "";

    if (type === "summary") 
      prompt = `Summarize these notes in simple bullet points:\n${text}`;
    if (type === "flashcards")
      prompt = `Create flashcards from these notes. Q:..., A:...\nNotes:\n${text}`;
    if (type === "quiz")
      prompt = `Create 10 quiz questions with answers:\n${text}`;
    if (type === "explain5")
      prompt = `Explain these notes like I'm 5:\n${text}`;
    if (type === "translate")
      prompt = `Translate these notes to Albanian:\n${text}`;

    const response = await askGPT(prompt);
    setResult(response);
    setLoading(false);
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
    >
      <Text style={[styles.header, { color: theme.textPrimary }]}>
        AI Study Assistant
      </Text>

      <GlassView intensity={60} style={[styles.glassBox, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { color: theme.textPrimary }]}
          placeholder="Paste your notes here..."
          placeholderTextColor={theme.textMuted}
          value={text}
          multiline
          onChangeText={setText}
        />
      </GlassView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12 }}
      >
        {modes.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => generate(m.id)}
              activeOpacity={0.8}
              style={[
                styles.modeButton,
                {
                  backgroundColor: isActive ? theme.primary : theme.card,
                  borderColor: isActive ? theme.primary : theme.border,
                },
              ]}
            >
              <Ionicons
                name={m.icon}
                size={16}
                color={isActive ? "#fff" : theme.textPrimary}
              />
              <Text
                style={[
                  styles.modeLabel,
                  { color: isActive ? "#fff" : theme.textPrimary },
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Output */}
      <GlassView intensity={50} style={[styles.outputBox, { borderColor: theme.border }]}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <Text style={[styles.outputText, { color: theme.textPrimary }]}>
            {result || "No response yet."}
          </Text>
        )}
      </GlassView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 35,
  },

  glassBox: {
    borderRadius: 20,
    padding: 14,
    minHeight: 150,
    justifyContent: "flex-start",
  },

  input: {
    fontSize: 15,
    lineHeight: 20,
  },

  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
  },

  modeLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  outputBox: {
    marginTop: 20,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    minHeight: 200,
  },

  outputText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
