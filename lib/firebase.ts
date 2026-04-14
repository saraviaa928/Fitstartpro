import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI", // 👈 pega aquí tu apiKey REAL
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "