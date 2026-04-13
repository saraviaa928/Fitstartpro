import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "fitstartpro.firebasestorage.app",
  messagingSenderId: "632203203052",
  appId: "1:632203203052:web:290c3ced6a43303091f0c9"
};

const app = initializeApp(firebaseConfig);

// 🔥 EXPORTACIONES IMPORTANTES
export const auth = getAuth(app);
export const db = getFirestore(app);