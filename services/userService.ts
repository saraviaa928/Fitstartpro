import { db } from "@/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const createUserDoc = (uid: string, email: string) =>
  setDoc(doc(db, "usuarios", uid), {
    email,
    peso: "",
    meta: "",
    progreso: 0,
    racha: 0,
    premium: false,
    plan: "free",
  });

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserData = (uid: string, data: any) =>
  updateDoc(doc(db, "usuarios", uid), data);