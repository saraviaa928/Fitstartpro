import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaOuz28cLkd8GRT6e_3w4S8kYKBnloq6s",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "fitstartpro-e8392",
  storageBucket: "fitstartpro-e8392.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);