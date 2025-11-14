
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/config";


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


export const loginWithEmail = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return { ok: true, user: res.user };
    } catch (err) {
        return { ok: false, error: mapAuthError(err.code || err.message) };
    }
};


export const emailExists = async (email) => {
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        return methods.length > 0;
    } catch (err) {
        return false;
    }
};


export const registerWithEmail = async (name, email, password) => {
    try {
        const exists = await emailExists(email);

        if (exists) {
            return {
                ok: false,
                error: "This email is already registered.",
            };
        }

        const res = await createUserWithEmailAndPassword(auth, email, password);

        if (name && res.user) {
            await updateProfile(res.user, { displayName: name });
        }

        return {
            ok: true,
            user: res.user,
            name
        };
    } catch (err) {
        return { ok: false, error: mapAuthError(err.code || err.message) };
    }
};


export const validateRegistration = (fullName, email, password, confirm) => {
    if (!fullName || !fullName.trim()) return "Full name cannot be empty.";
    if (fullName.trim().length < 3)
        return "Full name must be at least 3 characters.";
    if (!/^[a-zA-Z\s]+$/.test(fullName.trim()))
        return "Full name can only contain letters.";

    if (!email || !email.includes("@")) return "Please enter a valid email.";

    if (!password || password.length < 8)
        return "Password must be at least 8 characters.";

    if (password !== confirm) return "Passwords do not match.";

    return null;
};


export const registerUser = async (email, password, fullName) => {
    try {
        const result = await registerWithEmail(fullName, email, password);

        return {
            ok: result.ok,
            user: result.user,
            name: fullName,  
            error: result.error,
        };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
};
