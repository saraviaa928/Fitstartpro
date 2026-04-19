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
        setPeso(data.peso);
        setMeta(data.meta);
        setProgreso(data.progreso);
        setRacha(data.racha);
        setPremium(data.premium);
      }
    } catch {
      const res = await registerUser(email, password);
      await createUserDoc(res.user.uid, email);
      alert("Cuenta creada");
    }
  };

  useEffect(() => {
    if (!user) return;

    getUserData(user.uid).then((data: any) => {
      if (data) {
        setPeso(data.peso);
        setMeta(data.meta);
        setProgreso(data.progreso);
        setRacha(data.racha);
        setPremium(data.premium);
      }
    });
  }, [user]);

  const guardar = async () => {
    if (!user) return;

    const p = parseFloat(peso);
    const m = parseFloat(meta);

    if (isNaN(p) || isNaN(m)) return alert("Valores inválidos");

    const prog = Math.min((p / m) * 100, 100);

    await updateUserData(user.uid, {
      peso,
      meta,
      progreso: prog,
      racha: racha + 1,
    });

    setProgreso(prog);
    setRacha(racha + 1);
  };

  const suscribirse = async () => {
    const res = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      body: JSON.stringify({ uid: user.uid }),
    });

    const data = await res.json();
    window.location.href = data.approve;
  };

  return (
    <main style={{ padding: 20, color: "white" }}>
      <h1>💪 FitStartPro</h1>

      {!user ? (
        <>
          <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
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

          {!premium && (
            <button onClick={suscribirse}>
              💳 Suscribirme $4.99
            </button>
          )}

          {premium && <p>🔥 PRO ACTIVO</p>}

          <input placeholder="peso" onChange={(e) => setPeso(e.target.value)} />
          <input placeholder="meta" onChange={(e) => setMeta(e.target.value)} />

          <button onClick={guardar}>Guardar</button>

          <p>Progreso: {progreso}%</p>
          <p>Racha: {racha}</p>
        </>
      )}
    </main>
  );
}