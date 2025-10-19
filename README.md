# 🎓 GoCampus

[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76+-20232A.svg?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-000020.svg?logo=expo&logoColor=white)](https://expo.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


**GoCampus** is a mobile application built with **Expo / React Native**, designed to help students discover and join campus **groups**, keep track of **upcoming events**, view **leaderboards**, access **resources**, and manage their **profile** — all in one place.  
The goal of this project is to make it easy for students to quickly find communities, stay informed, and participate in campus life.

---

## 🧭 Project Overview

GoCampus provides a simple and efficient way for students to:
- 🔍 **Browse student groups** with search and filters (category, joined-only, minimum members, activity).
- ➕ **Create a new group** (name, category, description, tags, members, activity).
- 📅 **See upcoming events** in a horizontal carousel (standalone events).
- 📝 **Create an event** (title, date, time, location, optional image).
- 👥 **Join/Leave groups** and view them in **My Groups**.
- 📊 **Check the leaderboard** for rankings/challenges.
- 📚 **Open campus resources** from a centralized list.
- 👤 **View profile** (placeholder for account info and settings).

---

## ✨ Key Features

- 🧑‍🤝‍🧑 **Groups Screen** – search & chips, filters (joined-only, min members/activity), join/leave, **My Groups** carousel, **Create Group** & **Create Event** modals.  
- 📅 **Upcoming Events** – global horizontal events rail (soonest first).  
- 🏆 **Leaderboard Screen** – rankings placeholder (for house points/challenges).  
- 📚 **Resources Screen** – quick links and materials placeholder.  
- 👤 **Profile Screen** – profile/settings placeholder.  
- 🌓 **Theme** – light/dark mode via ThemeProvider.

---

## 🛠️ Tech Stack

| Component            | Technology                          |
|---------------------|--------------------------------------|
| Frontend            | **React Native**                     |
| Framework/Tooling   | **Expo**                             |
| Programming Language| **JavaScript (ES6)**                 |
| UI Icons            | **@expo/vector-icons (Ionicons)**    |
| Safe Areas          | **react-native-safe-area-context**   |
| Visual Effects      | **expo-glass-effect**                |
| State/Theme         | **Context (ThemeProvider)**          |
| IDE                 | **Visual Studio Code**               |
| Version Control     | **Git & GitHub**                     |

---

## 📲 UI Preview

### 🔹 Home
<img src="./assets/home.jpg" width="350"/>

### 🔹 Groups Screen
<img src="./assets/groups.jpg" width="350"/>

### 🔹 Leaderboard
<img src="./assets/leaderboard.jpg" width="350"/>

### 🔹 Resources
<img src="./assets/resources.jpg" width="350"/>

### 🔹 Profile
<img src="./assets/profile.jpg" width="350"/>

---

## 📁 Minimal Structure

```
gocampus/
│
├── app/                         # All screens (Expo Router)
│   ├── _layout.jsx              # Tabs / navigation shell
│   ├── index.jsx                # Home (Landing / Dashboard)
│   ├── groups.jsx               # Groups screen (create/join/edit)
│   ├── resources.jsx            # Resource sharing (notes/books/equipment)
│   ├── leaderboard.jsx          # Leaderboard screen
│   └── profile.jsx              # Profile screen
│
├── assets/                      # Images and backgrounds
│   ├── backgrounds/
│   │   ├── light.png
│   │   └── dark.png
│   └── img/
│       ├── groups.jpg
│       ├── home.jpg
│       ├── leaderboard.jpg
│       ├── profile.jpg
│       ├── resources.jpg
│       └── splash-icon.png
│
├── components/                  # Reusable UI blocks + modals
│   ├── CreateEventModal.js
│   ├── CreateGroupModal.js
│   ├── CreateResourceModal.js
│   ├── EditGroupModal.js
│   ├── EditSettingModal.js
│   ├── EventCard.js
│   ├── GroupDetail.js
│   ├── ProfileActions.js
│   ├── SettingsList.js
│   └── index.js                 # (optional: export all components here)
│
├── constants/
│   └── colors.js                # Centralized theme colors (light/dark)
│
├── context/
│   └── ThemeProvider.js         # Theme context + custom hook
│
├── app.json
├── package.json
├── package-lock.json
└── README.md

```

---

## 🚀 Getting Started

```bash
npm install
npx expo start
```

- Press **i** (iOS), **a** (Android), or scan the QR with **Expo Go**.

---


## 👥 Project Team

**Developed by:**  
- [Enkel Berisha](https://github.com/enkelberisha)
- [Ermir Meziu](https://github.com/ErmirMeziu)
- [Vlera Galica](https://github.com/vleragalica)
- [Eron Berisha](https://github.com/eronberishaa)

FIEK - Universiteti i Prishtines

---

## 📄 License

This project is intended for educational purposes.  
You may freely use and modify it for learning and non-commercial use.  
(Consider adding **MIT** or another license if you plan to open-source.)
