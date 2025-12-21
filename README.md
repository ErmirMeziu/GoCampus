# 🎓 GoCampus — Student Community App

[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76+-20232A.svg?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-000020.svg?logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28.svg?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📱 Përshkrim i Aplikacionit

**GoCampus** është një aplikacion mobil i zhvilluar me React Native (Expo) që synon të lidhë studentët universitarë përmes një platforme të centralizuar për grupe studentore, evente, dhe burime akademike. Aplikacioni përfshin një sistem autentikimi të sigurt, ruajtje të të dhënave në kohë reale përmes Firebase, si dhe mekanizma gamification me pikë dhe leaderboard për të rritur angazhimin e përdoruesve. Me një dizajn modern, mbështetje për Dark/Light Mode dhe navigim intuitiv, GoCampus ofron një eksperiencë të thjeshtë dhe efikase për menaxhimin e aktiviteteve akademike dhe sociale në kampus.

---

## ⭐ Funksionalitetet Kryesore

### 🔐 Autentikimi
- Kyçje me **Email & Password**
- Kyçje me **GitHub**
- Rruge të mbrojtura për përdorues të autentikuar

### 👤 Profili i Përdoruesit
- Ndryshim i të dhënave personale
- Foto profili me **crop & zoom**
- Menaxhim i llogarive të lidhura
- Logout nga aplikacioni

### 👥 Grupet
- Shfaqje e të gjitha grupeve
- Bashkim / largim nga grupet
- Krijim dhe editim i grupeve
- Ruajtje e anëtarëve në Firebase Firestore

### 📅 Eventet
- Krijim eventesh me datë, orë dhe lokacion
- Feed i eventeve të ardhshme

### 📚 Burimet Akademike
- Upload i librave, shënimeve dhe materialeve
- Ruajtje në Firebase Storage
- Fitim pikësh për çdo kontribuim

### 🏆 Pikë & Leaderboard
- Sistem pikësh për aktivitetet e përdoruesit
- Leaderboard real-time
- Rankim dhe podium për **Top 3** studentët

### 🤖 Notes AI
- Gjenerim dhe shpjegim i shënimeve
- Integrim me AI për ndihmë akademike

### 🎨 UI & Navigimi
- Custom **Glass Tab Bar**
- **Dark / Light Mode**
- Animacione dhe blur effects
---

## 🖼️ Screenshots të Aplikacionit

### 🔐 Authentication
<p align="center">
  <img src="/assets/screenshots/prelogin.jpg" width="260" />
  <img src="/assets/screenshots/login.jpg" width="260" />
  <img src="/assets/screenshots/register.jpg" width="260" />
</p>

### 🏠 Home
<p align="center">
  <img src="/assets/screenshots/home.jpg" width="260" />
</p>

### 👥 Groups
<p align="center">
  <img src="/assets/screenshots/events.jpg" width="260" />
</p>

### 📚 Resources
<p align="center">
  <img src="/assets/screenshots/resources.jpg" width="260" />
</p>


### 🏆 Leaderboard
<p align="center">
  <img src="/assets/screenshots/leaderboard.jpg" width="260" />
</p>


### 🤖 Notes AI
<p align="center">
  <img src="/assets/screenshots/ai.jpg" width="260" />
</p>


### 👤 Profile
<p align="center">
  <img src="/assets/screenshots/profile.jpg" width="260" />
</p>



---

## 🛠️ Teknologjitë e Përdorura

| Pjesa | Teknologjia |
|------|------------|
| Frontend | React Native (Expo) |
| Routing | Expo Router |
| Autentikimi | Firebase Auth |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| UI Effects | expo-glass-effect |
| Ikonat | Ionicons |
| Theme | Context API |

---

## 🚀 Udhëzime për Instalimin

1. Klononi repository-n:
```bash
git clone https://github.com/ErmirMeziu/GoCampus
```

2. Instaloni varësitë:
```bash
npm install
```

3. Startoni aplikacionin:
```bash
npx expo start --tunnel
```

4.Hapeni aplikacionin:
- i → iOS Simulator
- a → Android Emulator
- Ose skanoni QR-Code me Expo Go

---

##  Udhëzime për Testimin

```bash
npm test
```
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
