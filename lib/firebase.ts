import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ PEGA TU API KEY REAL AQUÍ
const firebaseConfig = {
  apiKey: "AIzaSyCpoOjcZKvPJJAhGDiWSheL8HpgXeBUB2o",
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "fitstartpro.appspot.com",
  messagingSenderId: "632203203052",
  appId: "1:632203203052:web:290c3ced6a43303091f0c9",
};

// 🔥 Evita reinicialización (error común)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// 🔐 Auth
export const auth = getAuth(app);

// ☁️ Base de datos
export const db = getFirestore(app);