import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { auth } from "./firebase";

export const signIn = async () => {
    return new Promise((resolve, reject) => {
        // Subscribe to auth state changes to return existing user or new one
        const unsubscribe = onAuthStateChanged(auth, (user) => {
             if (user) {
                 unsubscribe();
                 resolve(user.uid);
             }
        });

        // 1. Try Custom Token if available
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            signInWithCustomToken(auth, __initial_auth_token).catch((error) => {
                 console.warn("Custom token auth failed, falling back to anonymous.", error);
                 fallbackAnonymous();
            });
        } else {
            // 2. Fallback to Anonymous
            fallbackAnonymous();
        }

        function fallbackAnonymous() {
             // Only sign in if not already loading (onAuthStateChanged handles the "already signed in" case, 
             // but signInAnonymously is safe to call if not signed in)
             if (!auth.currentUser) {
                signInAnonymously(auth).catch(reject);
             }
        }
    });
};

export const getCurrentUser = () => {
    return auth.currentUser;
}
