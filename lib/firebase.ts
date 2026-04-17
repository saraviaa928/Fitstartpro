// lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AQUI_TU_API_KEY_REAL",
  authDomain: "AQUI_TU_AUTH_DOMAIN_REAL",
  projectId: "AQUI_TU_PROJECT_ID_REAL",
  storageBucket: "AQUI_TU_STORAGE_BUCKET_REAL",
  messagingSenderId: "AQUI_TU_SENDER_ID_REAL",
  appId: "AQUI_TU_APP_ID_REAL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);