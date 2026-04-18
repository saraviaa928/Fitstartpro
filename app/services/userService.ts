import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const COLLECTION = "usuarios";

export const createUserDoc = async (uid: string, email: string) => {
  await setDoc(doc(db, COLLECTION, uid), {
    email,
    progreso: 0,
    racha: 0,
  });
};

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserData = async (uid: string, data: any) => {
  await setDoc(doc(db, COLLECTION, uid), data, { merge: true });
};