import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Configuración de tu app
const firebaseConfig = {
  apiKey: "AIzaSyBRiGWCAxMeW8kV0iYb5rxhH-XBOGDkKIc",
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "fitstartpro.firebasestorage.app",
  messagingSenderId: "632203203052",
  appId: "1:632203203052:web:290c3ced6a43303091f0c9",
};

// 🔥 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Auth (login)
export const auth = getAuth(app);