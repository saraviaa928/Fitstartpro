"use client";

import { useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Success() {
  useEffect(() => {
    const activarPro = async () => {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(
        doc(db, "usuarios", user.uid),
        { pro: true },
        { merge: true }
      );
    };

    activarPro();
  }, []);

  return <h1>Pago exitoso 🎉 PRO activado</h1>;
}