import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "fitstartpro.firebaseapp.com",
  projectId: "fitstartpro",
  storageBucket: "fitstartpro.appspot.com",
  messagingSenderId: "632203203052",
  appId: "1:632203203052:web:..."
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 EXPORTAR FIRESTORE