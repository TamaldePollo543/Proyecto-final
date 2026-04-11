import { auth, googleProvider } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthService = {
    async login(email, password) {
        return await signInWithEmailAndPassword(auth, email, password);
    },

    async signup(email, password) {
        return await createUserWithEmailAndPassword(auth, email, password);
    },

    async loginWithGoogle() {
        return await signInWithPopup(auth, googleProvider);
    },

    async logout() {
        return await signOut(auth);
    },

    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    },

    getCurrentUser() {
        return auth.currentUser;
    }
};