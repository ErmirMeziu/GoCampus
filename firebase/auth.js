// firebase/auth.js
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
} from "firebase/auth";

import { auth } from "./config";

// ✅ Convert Firebase errors into friendly text
export const mapAuthError = (code) => {
    if (code.includes("auth/user-not-found")) return "No account found with this email.";
    if (code.includes("auth/wrong-password")) return "Incorrect password.";
    if (code.includes("auth/invalid-email")) return "Invalid email address.";
    if (code.includes("auth/email-already-in-use"))
        return "This email is already registered.";
    if (code.includes("auth/account-exists-with-different-credential"))
        return "This email is already registered with another login method.";
    return code;
};

/* -------------------------------------------
    LOGIN WITH EMAIL
------------------------------------------- */
export const loginWithEmail = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return { ok: true, user: res.user };
    } catch (err) {
        return { ok: false, error: mapAuthError(err.code || err.message) };
    }
};

/* -------------------------------------------
    CHECK IF EMAIL EXISTS (before register or oauth)
------------------------------------------- */
export const emailExists = async (email) => {
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        return methods.length > 0;
    } catch (err) {
        return false;
    }
};

/* -------------------------------------------
    REGISTER EMAIL + PASSWORD
------------------------------------------- */
export const registerWithEmail = async (name, email, password) => {
    try {
        const exists = await emailExists(email);
        if (exists)
            return {
                ok: false,
                error: "This email is already registered.",
            };

        const res = await createUserWithEmailAndPassword(auth, email, password);

        // Optional: update name
        if (name && res.user) {
            await res.user.updateProfile({ displayName: name });
        }

        return { ok: true, user: res.user };
    } catch (err) {
        return { ok: false, error: mapAuthError(err.code || err.message) };
    }
};
