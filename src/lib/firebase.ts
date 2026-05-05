
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import type { Hotel } from './types';


export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock_key_for_build",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

export async function getApprovedHotels() {
    try {
        const querySnapshot = await getDocs(collection(db, 'hotels'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Hotel[];
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return [];
    }
}
