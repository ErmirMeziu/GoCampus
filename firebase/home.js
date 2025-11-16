import { db } from "./config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const EVENTS = collection(db, "events");

export const createEvent = async (payload = {}) => {
  return addDoc(EVENTS, {
    title: payload.title || "New Campus Event",
    date: payload.date || "TBD",
    location: payload.location || "Campus",
    description: payload.description || "",
    image: payload.image || "https://picsum.photos/800/600",
    likes: 0,
    comments: 0,
    isHot: false,
    createdBy: payload.createdBy || null,
    createdAt: serverTimestamp(),
  });
};

export const listenEvents = (callback) => {
  const q = query(EVENTS, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
};

export const likeEvent = async (id, currentLikes = 0) => {
  const ref = doc(db, "events", id);
  return updateDoc(ref, { likes: (currentLikes || 0) + 1 });
};

export const deleteEvent = async (id) => {
  return deleteDoc(doc(db, "events", id));
};
