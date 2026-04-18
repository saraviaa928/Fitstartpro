// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "fitstartpro-e8392.firebaseapp.com",
  projectId: "fitstartpro-e8392",
  storageBucket: "fitstartpro-e8392.firebasestorage.app",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID",
};

// 🔥 evita reinicialización en Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);