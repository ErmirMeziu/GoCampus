
import { initializeApp } from firebase/app;
import { getAuth } from firebase/auth;
import { getFirestore } from firebase/firestore;

const firebaseConfig = {
  apiKey: "AIzaSyBZgkUBCKKmkUgmNqKmN2k3eDHEapqxz4o",
  authDomain: "gocampus-1892d.firebaseapp.com",
  projectId: "gocampus-1892d",
  storageBucket: "gocampus-1892d.firebasestorage.app",
  messagingSenderId: "58782162250",
  appId: "1:58782162250:web:b5abac56c78d0174f735b3"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);