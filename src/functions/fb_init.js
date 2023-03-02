import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { firebaseConfig } from "./fb_config";


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
export const db = getFirestore(app)
