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
import { LinearGradient } from "expo-linear-gradient";
import { askGPT } from "../../utils/gpt";
import { useTheme } from "../../context/ThemeProvider";

const GRADIENTS = {
  background: ["#0F172A", "#1E293B"],      
  card: ["#1E293B", "#111827"],            
  active: ["#6366F1", "#8B5CF6"],           
  output: ["#111827", "#1F2937"],           
};

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
    if (type === "quiz") prompt = `Create 10 quiz questions with answers:\n${text}`;
    if (type === "explain5") prompt = `Explain these notes like I'm 5:\n${text}`;
    if (type === "translate") prompt = `Translate these notes to Albanian:\n${text}`;

    const response = await askGPT(prompt);
    setResult(response);
    setLoading(false);
  }

  return (
    <LinearGradient colors={GRADIENTS.background} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>AI Study Assistant</Text>
        <Text style={styles.subheader}>
          Smart notes • Fast learning • AI powered
        </Text>

        <LinearGradient colors={GRADIENTS.card} style={styles.card}>
          <GlassView intensity={60} style={styles.glass}>
            <TextInput
              style={styles.input}
              placeholder="Paste your notes here..."
              placeholderTextColor="#9CA3AF"
              value={text}
              multiline
              onChangeText={setText}
            />
          </GlassView>
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
          {modes.map((m) => {
            const active = activeMode === m.id;

            return (
              <TouchableOpacity key={m.id} onPress={() => generate(m.id)}>
                {active ? (
                  <LinearGradient colors={GRADIENTS.active} style={styles.modeBtn}>
                    <Ionicons name={m.icon} size={16} color="#fff" />
                    <Text style={styles.modeTextActive}>{m.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.modeBtn, styles.modeInactive]}>
                    <Ionicons name={m.icon} size={16} color="#CBD5E1" />
                    <Text style={styles.modeText}>{m.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <LinearGradient colors={GRADIENTS.card} style={[styles.card,{marginTop:20}]}>
          <GlassView intensity={60} style={styles.glass}>
            {loading ? (
            <View >
              <Text style={styles.loadingText}>Generating…</Text>
            </View>
          ) : (
            <Text style={styles.result}>
              {result || "No response yet."}
            </Text>
          )}
          </GlassView>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 120,
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 60,
    color: "#E5E7EB",
  },

  subheader: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 13,
    color: "#9CA3AF",
  },

  card: {
    borderRadius: 20,
    padding: 2,
  },

  glass: {
    borderRadius: 18,
    padding: 14,
    minHeight: 160,
  },

  input: {
    fontSize: 15,
    lineHeight: 22,
    color: "#E5E7EB",
  },

  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 10,
  },

  modeInactive: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  modeText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "600",
    color: "#CBD5E1",
  },

  modeTextActive: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },

  output: {
    marginTop: 18,
    borderRadius: 20,
    padding: 16,
    minHeight: 220,
    
  },

  result: {
    fontSize: 15,
    lineHeight: 22,
    color: "#E5E7EB",
  },

  loading: {
    alignItems: "center",
    gap: 10,
    paddingTop: 20,
  },

  loadingText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
