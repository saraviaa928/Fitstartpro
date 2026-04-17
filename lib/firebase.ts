// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaOuz28cLkd8GRT6e_3w4S8kYKBnloq6s",
  authDomain: "fitstartpro-e8392.firebaseapp.com",
  projectId: "fitstartpro-e8392",
  storageBucket: "fitstartpro-e8392.firebasestorage.app",
  messagingSenderId: "1073053557711",
  appId: "1:1073053557711:web:6288c0228f1f72727e68ba"
};

// 🔥 Evita reinicialización en Next.js (MUY IMPORTANTE)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);