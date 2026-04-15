import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 CONFIGURACIÓN (PEGA TU API KEY REAL)
const firebaseConfig = {
  apiKey: "AQUI_TU_API_KEY_REAL", // 👈 reemplaza esto
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "fitstartpro.appspot.com", // ✅ correcto
  messagingSenderId: "632203203052",
  appId: "1:632203203052:web:290c3ced6a43303091f0c9",
};

// 🔥 Evita errores de múltiples inicializaciones
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔐 Auth
export const auth = getAuth(app);

// ☁️ Firestore
export const db = getFirestore(app);