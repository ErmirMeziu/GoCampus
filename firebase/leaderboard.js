
import { db } from "./config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export const subscribeToLeaderboard = (callback) => {
  try {
    const q = query(collection(db, "users"), orderBy("points", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(arr);
    });

    return unsub; // caller must cleanup
  } catch (e) {
    console.log("Leaderboard error:", e);
    return () => {};
  }
};
