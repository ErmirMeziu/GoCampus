
import { db } from "./config";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
} from "firebase/firestore";


import {
    EmailAuthProvider,
    linkWithCredential,
} from "firebase/auth";
import { auth } from "./config";

export const createUserProfileIfNotExists = async (uid, email, name) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, {
            uid,
            email,
            name,
            phone: "",
            dob: "",
            language: "English",
            notifications: true,
            darkMode: false,
            githubLinked: false,
            emailLinked: true,       
            photoURL: null,
            createdAt: new Date(),
        });
    }
};


export const listenUserProfile = (uid, callback) => {
    return onSnapshot(doc(db, "users", uid), (snap) => {
        callback(snap.data());
    });
};


export const updateUserProfile = (uid, data) => {
    return updateDoc(doc(db, "users", uid), data);
};


export const linkGitHubToProfile = async (uid) => {
    try {
        await updateUserProfile(uid, { githubLinked: true });
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};


export const linkEmailPasswordToProfile = async (uid, email, password) => {
    try {
        const credential = EmailAuthProvider.credential(email, password);

    
        await linkWithCredential(auth.currentUser, credential);

     
        await updateUserProfile(uid, {
            emailLinked: true,
            email: email,
        });

        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};
