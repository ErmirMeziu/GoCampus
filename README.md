# 🎓 GoCampus — Student Community App

[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76+-20232A.svg?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-000020.svg?logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28.svg?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**GoCampus** is a full-featured mobile platform built with **Expo / React Native**, enabling university students to connect through **groups**, participate in campus events, earn **points**, compete on the **leaderboard**, access learning **resources**, and manage personal **profiles** with advanced account linking.

---

## 🚀 Latest Features (2025 Update)

### 🔐 Authentication
- Login with **Email + Password**
- **GitHub auth** (web + Android, disabled on iOS)
- Link/unlink email login
- Protected routes using Firebase Auth

### 🖼️ Profile
- Editable settings (name, phone, DOB, language, notifications)
- **Advanced profile picture cropper** (zoom + drag)
- Connected emails & GitHub account section
- Logout button integrated in UI

### 🏆 Points & Leaderboard
- Firestore-powered real-time leaderboard  
- Users automatically earn points for actions:
  - Joining a group  
  - Creating a group  
  - Creating an event  
  - Uploading a resource  
  - Commenting  
- Shows:
  - Your **rank**
  - Your **points**
  - Top 3 with podium layout
  - Scrollable list of others

### 👥 Groups
- View all groups
- Join / Leave groups
- My Groups carousel
- Create group modal
- Edit group details
- Group membership saved in Firestore (`joinedBy` array)

### 📅 Events
- Create events with title, date/time, location, optional image
- Global upcoming events feed sorted by date

### 📚 Resources
- Centralized notes/books/resources added by students
- Upload from device
- Awards points on upload

### 🤖 Notes AI
- Smart note-making and explanations
- Uses LLM integration

### 🧭 Custom Glass Tab Bar
- Fully custom bottom tab bar
- Glass blur effect
- Double-tap to reload data
- Animated active icon
- Works on iOS, Android, Web

---

## 🛠️ Tech Stack

| Feature | Technology |
|--------|------------|
| Frontend | React Native (Expo) |
| Routing | Expo Router |
| Auth | Firebase Auth |
| Database | Firestore |
| Storage | Firebase Storage |
| UI Effects | expo-glass-effect |
| Icons | Ionicons |
| Theme | Context API (light/dark) |


## 🚀 Getting Started

```bash
npm install
npx expo start
```

- Press **i** (iOS), **a** (Android), or scan the QR with **Expo Go**.

---


## 👥 Project Team

**Developed by:**  
- [Eron Berisha](https://github.com/eronberishaa)
- [Enkel Berisha](https://github.com/enkelberisha)
- [Ermir Meziu](https://github.com/ErmirMeziu)
- [Vlera Galica](https://github.com/vleragalica)


FIEK - Universiteti i Prishtines

---

## 📄 License

This project is intended for educational purposes.  
You may freely use and modify it for learning and non-commercial use.  
(Consider adding **MIT** or another license if you plan to open-source.)
