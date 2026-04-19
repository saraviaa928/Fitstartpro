"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { loginUser, registerUser } from "@/services/authService";
import {
  createUserDoc,
  getUserData,
  updateUserData,
} from "@/services/userService";

export default function Home() {
  const user = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);
  const [premium, setPremium] = useState(false);

  const handleAuth = async () => {
    try {
      const res = await loginUser(email, password);
      const data: any = await getUserData(res.user.uid);

      if (data) {
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setProgreso(data.progreso || 0);
        setRacha(data.racha || 0);
        setPremium(data.premium || false);
      }
    } catch {
      const res = await registerUser(email, password);
      await createUserDoc(res.user.uid, email);
      alert("Cuenta creada");
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data: any = await getUserData(user.uid);
      if (data) {
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setProgreso(data.progreso || 0);
        setRacha(data.racha || 0);
        setPremium(data.premium || false);
      }
    };
    load();
  }, [user]);

  const guardar = async () => {
    if (!user) return;

    const nuevo = Math.min(
      (parseFloat(peso) / parseFloat(meta)) * 100,
      100
    );

    await updateUserData(user.uid, {
      peso,
      meta,
      progreso: nuevo,
      racha: racha + 1,
    });

    setProgreso(nuevo);
    setRacha(racha + 1);
  };

  const comprarPremium = async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      body: JSON.stringify({ value: "5.00" }),
    });

    const data = await res.json();

    const capture = await fetch("/api/paypal/capture-order", {
      method: "POST",
      body: JSON.stringify({
        orderId: data.id,
        uid: user?.uid,
      }),
    });

    const result = await capture.json();

    if (result.status === "COMPLETED") {
      setPremium(true);
      alert("🔥 Eres PRO");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>💪 FitStartPro</h1>

      {!user ? (
        <>
          <input
            placeholder="correo"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAuth}>Entrar</button>
        </>
      ) : (
        <>
          <p>{user.email}</p>

          <input
            placeholder="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
          <input
            placeholder="meta"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
          />
          <button onClick={guardar}>Guardar</button>

          <p>Progreso: {progreso.toFixed(0)}%</p>
          <p>Racha: {racha}</p>

          {premium ? (
            <h2>🔥 Eres PRO</h2>
          ) : (
            <button onClick={comprarPremium}>
              Comprar Premium
            </button>
          )}
        </>
      )}
    </main>
  );
}