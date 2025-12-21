import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  where
} from "firebase/firestore";

import { db, auth } from "./config";
import { addPoints } from "../firebase/points";

const groupsCol = collection(db, "groups");
const eventsCol = collection(db, "events");

export function listenGroups(callback) {
  return onSnapshot(groupsCol, (snapshot) => {
    const groups = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(groups);
  });
}

export function listenEvents(callback) {
  return onSnapshot(eventsCol, (snapshot) => {
    const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(events);
  });
}

export async function createGroupDB(group) {
  return await addDoc(groupsCol, {
    ...group,
    createdAt: Date.now(),
    ownerId: auth.currentUser.uid,
    joinedBy: [auth.currentUser?.uid],
    members: 1,
  });
}

export async function updateGroupDB(id, data) {
  return await updateDoc(doc(db, "groups", id), data);
}

export async function deleteGroupDB(id) {
  await deleteDoc(doc(db, "groups", id));

  const q = query(eventsCol, where("groupId", "==", id));
  const snap = await getDocs(q);

  snap.forEach((e) => deleteDoc(doc(db, "events", e.id)));
}

export async function toggleJoinDB(group) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const isJoined = group.joinedBy?.includes(uid);

  const updated = isJoined
    ? group.joinedBy.filter((u) => u !== uid)
    : [...group.joinedBy, uid];

  await updateDoc(doc(db, "groups", group.id), {
    joinedBy: updated,
    members: updated.length,
  });
  if (!isJoined) {
    addPoints(uid, "joinGroup");
  }
}

export async function createEventDB(event) {
  const uid = auth.currentUser?.uid;

  if (event.groupId) {
    const groupRef = doc(db, "groups", event.groupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      const group = groupSnap.data();

      if (group.ownerId !== uid) {
        console.log(" Not authorized to create event");
        return;
      }
    }
  }

  return await addDoc(eventsCol, {
    ...event,
    createdAt: Date.now(),
  });
}

export const listenUpcomingEventsForUser = (userId, callback) => {
  let unsubEvents = null;

  const safeDate = (e) => {
  const raw = e?.date;
  if (!raw) return null;

  // Firestore Timestamp
  if (raw?.toDate) return raw.toDate();

  if (typeof raw === "string") {
    const dateStr = raw.trim();

    // ✅ "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-").map(Number);

      // ✅ merge time "HH:MM" if present
      if (typeof e.time === "string" && /^\d{2}:\d{2}$/.test(e.time.trim())) {
        const [hh, mm] = e.time.trim().split(":").map(Number);
        return new Date(y, m - 1, d, hh, mm, 0, 0);
      }

      // ✅ no time -> end of day
      return new Date(y, m - 1, d, 23, 59, 59, 999);
    }

    // ISO or other
    const parsed = new Date(dateStr);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
};


  const unsubGroups = listenGroups((groups) => {
    const joinedGroupIds = new Set(
      groups
        .filter((g) => Array.isArray(g.joinedBy) && g.joinedBy.includes(userId))
        .map((g) => g.id)
    );

    const ownedGroupIds = new Set(
      groups
        .filter((g) => g.ownerId === userId)
        .map((g) => g.id)
    );

    // IMPORTANT: unsubscribe previous events listener before creating a new one
    if (unsubEvents) unsubEvents();

    unsubEvents = listenEvents((events) => {
      const now = new Date();

      const filtered = events.filter((e) => {
        const d = safeDate(e);
        if (!d) return false;
        if (d < now) return false;

        const isNoGroup = !e.groupId;
        const isInJoinedGroup = e.groupId && joinedGroupIds.has(e.groupId);
        const isInOwnedGroup = e.groupId && ownedGroupIds.has(e.groupId);
        const isMine = e.createdBy === userId;

        return isNoGroup || isInJoinedGroup || isInOwnedGroup || isMine;
      });

      // optional: sort soonest first
      filtered.sort((a, b) => safeDate(a) - safeDate(b));

      callback(filtered);
    });
  });

  return () => {
    if (unsubEvents) unsubEvents();
    if (unsubGroups) unsubGroups();
  };
};
