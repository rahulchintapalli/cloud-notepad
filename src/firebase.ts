import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO0dMNebDBA64MndnDwB4QEPLL5EpowIo",
  authDomain: "readnote-70c17.firebaseapp.com",
  projectId: "readnote-70c17",
  storageBucket: "readnote-70c17.firebasestorage.app",
  messagingSenderId: "264388119887",
  appId: "1:264388119887:web:16f1941a1f0218b43ac93a",
  measurementId: "G-97Q7Z4JHYG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
