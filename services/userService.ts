import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const createUserDoc = async (uid: string, email: string) => {
  await setDoc(doc(db, "usuarios", uid), {
    email,
    premium: false,
    createdAt: new Date(),
  });
};

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserData = async (uid: string, data: any) => {
  await updateDoc(doc(db, "usuarios", uid), data);
};