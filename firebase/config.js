
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBZgkUBCKKmkUgmNqKmN2k3eDHEapqxz4o",
  authDomain: "gocampus-1892d.firebaseapp.com",
  projectId: "gocampus-1892d",
  storageBucket: "gocampus-1892d.firebasestorage.app",
  messagingSenderId: "58782162250",
  appId: "1:58782162250:web:b5abac56c78d0174f735b3",
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "ios" || Platform.OS === "android") {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
