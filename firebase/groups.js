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
  const unsubGroups = listenGroups((groups) => {
    const joinedGroupIds = new Set(
      groups
        .filter(g => g.joinedBy?.includes(userId))
        .map(g => g.id)
    );

    const unsubEvents = listenEvents((events) => {
      const now = new Date();

      const filtered = events.filter(e => {
        const d = e.date?.toDate?.() || new Date(e.date);
        if (!d || d < now) return false;

        if (!e.groupId) return true;

        return joinedGroupIds.has(e.groupId);
      });

      callback(filtered);
    });

    return () => unsubEvents && unsubEvents();
  });

  return () => unsubGroups && unsubGroups();
};


