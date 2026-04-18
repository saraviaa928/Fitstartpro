import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};