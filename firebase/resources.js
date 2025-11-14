import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { uploadImage } from "./storage";

const RESOURCES = collection(db, "resources");

export const createResource = async (payload) => {
  const cleaned = {};
  for (const key in payload) {
    if (payload[key] !== undefined) {
      cleaned[key] = payload[key];
    }
  }

  const imageUrls = [];

  if (cleaned.images && cleaned.images.length > 0) {
    for (let uri of cleaned.images) {
      const url = await uploadImage(uri, "resources");
      imageUrls.push(url);
    }
  }

  return addDoc(RESOURCES, {
    ...cleaned,
    createdAt: new Date(),
  });
};

export const getAllResources = async () => {
  const snap = await getDocs(query(RESOURCES, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};


export const listenAllResources = (callback) => {
  return onSnapshot(
    query(RESOURCES, orderBy("createdAt", "desc")),
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(list);
    }
  );
};

export const getResourcesByType = async (type) => {
  const q = query(
    RESOURCES,
    where("resourceType", "==", type),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const searchResources = async (searchText) => {
  const q = query(RESOURCES, orderBy("title"));
  const snap = await getDocs(q);

  const lower = searchText.toLowerCase();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.title.toLowerCase().includes(lower));
};

export const updateResource = async (id, data) => {
  return updateDoc(doc(db, "resources", id), data);
};

export const deleteResource = async (id) => {
  return deleteDoc(doc(db, "resources", id));
};
