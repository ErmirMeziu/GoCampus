import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

// Default export a single React component for preview in the canvas
export default function ProfileScreen({ navigation, user = sampleUser }) {
  const [glassAvailable, setGlassAvailable] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  useEffect(() => {
    setGlassAvailable(isLiquidGlassAvailable());
  }, []);

  function handleSavePassword() {
    if (!newPassword || newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match or empty');
      return;
    }
    // Hook into your auth flow here
    Alert.alert('Success', 'Password changed');
    setShowChangePassword(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function LeaderboardCard({ rank, total, points }) {
    const pct = Math.max(0, Math.min(1, total > 0 ? (total - rank + 1) / total : 0));
    return (
      <View style={styles.leaderboardCard}>
        <Text style={styles.cardTitle}>Campus Leaderboard</Text>
        <Text style={styles.leaderboardText}>Rank: #{rank} / {total}</Text>
        <Text style={styles.leaderboardText}>Points: {points}</Text>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
        </View>
        <Text style={styles.smallMuted}>{Math.round(pct * 100)}% of top</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Glass header */}
      {glassAvailable ? (
        <GlassView style={styles.glassHeader} blurAmount={20}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>{user.name} {user.surname}</Text>
        </GlassView>
      ) : (
        <View style={[styles.glassHeader, styles.fallbackHeader]}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>{user.name} {user.surname}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name} {user.surname}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Pressable style={styles.changePwBtn} onPress={() => setShowChangePassword(true)}>
          <Text style={styles.changePwText}>Change password</Text>
        </Pressable>
      </View>

      <LeaderboardCard rank={user.rank} total={user.totalStudents} points={user.points} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Settings</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <TouchableOpacity style={styles.settingRow} onPress={() => setShowMoreSettings(true)}>
          <Text style={styles.settingLabel}>More settings</Text>
          <Text style={styles.chev}>{'>'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Confirm', 'Log out?', [ { text: 'Cancel' }, { text: 'Log out', style: 'destructive', onPress: () => {/* add logout flow */} } ])}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Change password modal */}
      <Modal visible={showChangePassword} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change password</Text>
            <TextInput placeholder="Current password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
            <TextInput placeholder="New password" secureTextEntry value={newPassword} onChangeText={setNewPassword} style={styles.input} />
            <TextInput placeholder="Confirm new password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />

            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowChangePassword(false)} style={styles.modalBtnSecondary}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSavePassword} style={styles.modalBtnPrimary}>
                <Text style={styles.modalBtnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* More settings modal (simple) */}
      <Modal visible={showMoreSettings} animationType="fade" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>More Settings</Text>
            <Text style={styles.smallMuted}>Common options you might add:</Text>
            <View style={{height:12}} />
            <Text style={styles.value}>• Notifications</Text>
            <Text style={styles.value}>• Privacy</Text>
            <Text style={styles.value}>• Connected apps</Text>
            <Text style={styles.value}>• Language</Text>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowMoreSettings(false)} style={styles.modalBtnPrimary}>
                <Text style={styles.modalBtnPrimaryText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

// ---------- sample data and styles ----------

const sampleUser = {
  name: 'Enkel',
  surname: 'Berisha',
  email: 'enkel@example.com',
  rank: 42,
  totalStudents: 420,
  points: 1280,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#F6F7F9',
  },
  glassHeader: {
    height: 140,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    justifyContent: 'center',
  },
  fallbackHeader: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSubtitle: { fontSize: 14, marginTop: 6, color: '#444' },

  card: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'white',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  label: { fontSize: 12, color: '#666', marginTop: 6 },
  value: { fontSize: 16, marginTop: 6 },

  changePwBtn: { marginTop: 10, paddingVertical: 8 },
  changePwText: { color: '#0b69ff', fontWeight: '600' },

  leaderboardCard: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'white',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  leaderboardText: { fontSize: 16, marginTop: 6, fontWeight: '600' },
  smallMuted: { fontSize: 12, color: '#888', marginTop: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700' },

  progressBackground: {
    height: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0b69ff',
  },

  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingLabel: { fontSize: 16 },
  chev: { fontSize: 18, color: '#999' },

  logoutBtn: { marginTop: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#e53935' },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { backgroundColor: 'white', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, padding: 10, marginTop: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  modalBtnPrimary: { backgroundColor: '#0b69ff', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8 },
  modalBtnPrimaryText: { color: 'white', fontWeight: '700' },
  modalBtnSecondary: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f2f2f2' },
});
