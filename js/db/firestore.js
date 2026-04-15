import { db } from '../auth/firebase.js';
import { collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const FirestoreService = {
    async saveResult(uid, text, ltData, aiEx) {
        try {
            await addDoc(collection(db, "history"), {
                uid,
                text,
                errors: ltData.matches.length,
                explanation: aiEx,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error saving:", error);
        }
    },

    async loadHistory(uid) {
        const q = query(collection(db, "history"), where("uid", "==", uid), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    },

    async getStats(uid) {
        const q = query(collection(db, "history"), where("uid", "==", uid));
        const snapshot = await getDocs(q);
        return snapshot.size;
    },

    async saveReadingResult(uid, score) {
        try {
            await addDoc(collection(db, "reading_scores"), {
                uid,
                score,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error saving reading score:", error);
        }
    }
};