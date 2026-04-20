"use client";

import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export default function Success() {
  useEffect(() => {
    const activatePro = async () => {
      const user = getAuth().currentUser;

      if (!user) return;

      const ref = doc(db, "usuarios", user.uid);

      await updateDoc(ref, {
        pro: true,
        updatedAt: new Date(),
      });
    };

    activatePro();
  }, []);

  return <h1>🔥 Suscripción activada</h1>;
}