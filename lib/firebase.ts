import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Tu configuración
const firebaseConfig = {
  apiKey: "AIzaSyBRiGWCAxMeW8kV0iYb5rxhH-XBOGDkKIc",
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "fitstartpro.appspot.com",
  messagingSenderId: "632203203052",
  appId: "1:632203203052:web:290c3ced6a43303091f0c9",
};

// 🔥 Evita reinicialización (MUY IMPORTANTE)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔥 Exportaciones
export const auth = getAuth(app);
export const db = getFirestore(app);