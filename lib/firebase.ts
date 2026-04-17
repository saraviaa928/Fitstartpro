// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaOuz28cLkd8GRT6e_3w4S8kYKBnloq6s",
  authDomain: "fitstartpro-e8392.firebaseapp.com",
  projectId: "fitstartpro-e8392",
  storageBucket: "fitstartpro-e8392.firebasestorage.app",
  messagingSenderId: "AQUI_TU_REAL_ID",
  appId: "AQUI_TU_REAL_APP_ID"
};

// 🔥 Evita reinicialización en Next.js (MUY IMPORTANTE)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);