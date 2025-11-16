
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { linkEmailPasswordToProfile } from "../firebase/profile";
import PasswordInput from "./PasswordInput";
import { useTheme, toOpacity } from "../context/ThemeProvider"; 

export default function EmailLogin({ uid, onClose }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");       
  const [error, setError] = useState("");  
  const [localError, setLocalError] = useState(""); 
  const { theme } = useTheme();

  const handleAdd = async () => {
    if (pass.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const res = await linkEmailPasswordToProfile(uid, email, pass);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    onClose(); 
  };

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>Add Email Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={(t) => setEmail(t.toLowerCase())}
        style={[styles.input, { color: theme.textPrimary, borderColor: toOpacity(theme.textPrimary, 0.3),borderWidth:1,}]}
        placeholderTextColor={"#aaa"}
      />

      <PasswordInput
        value={pass}                
        onChangeText={setPass}     
        placeholder="Password"
        theme={theme}
      />

      {localError ? <Text style={styles.error}>{localError}</Text> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={handleAdd}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "90%",
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    fontSize: 15,

  },  
  btn: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  cancel: {
    textAlign: "center",
    color: "red",
    marginTop: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
