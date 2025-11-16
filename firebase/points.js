
import { db } from "./config";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

export const POINT_VALUES = {
  createGroup: 20,
  createEvent : 10,
  uploadResource: 15,
  joinGroup: 5,

};


export async function addPoints(uid, action) {
  try {
    if (!POINT_VALUES[action]) {
      console.warn("⚠ Unknown action:", action);
      return;
    }

    const pointsToAdd = POINT_VALUES[action];
    const ref = doc(db, "users", uid);

    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        points: 0,
      });
    }

    await updateDoc(ref, {
      points: increment(pointsToAdd),
    });

    console.log(`🔥 Added +${pointsToAdd} points to ${uid} for ${action}`);
  } catch (err) {
    console.error("❌ Error adding points:", err);
  }
}
