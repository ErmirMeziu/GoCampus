// auth/githubAuth.js
import {
  GithubAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../firebase/config";

export const loginWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope("user:email");

    const result = await signInWithPopup(auth, provider);
    return { ok: true, user: result.user };
  } catch (err) {
    // --------------------------
    // 🔥 EMAIL EXISTS WITH PASSWORD
    // --------------------------
    if (err.code === "auth/account-exists-with-different-credential") {
      const email = err.customData?.email;

      if (email) {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("password")) {
          return {
            ok: false,
            error:
              "This email is already registered using Email & Password. Please log in using your password.",
          };
        }
      }
    }

    // default error
    return { ok: false, error: err.message };
  }
};
