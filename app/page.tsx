"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { loginUser, registerUser } from "@/services/authService";
import { createUserDoc, getUserData } from "@/services/userService";

export default function Home() {
  const user = useAuth();
  const [userData, setUserData]: any = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!user) return;

    getUserData(user.uid).then(setUserData);
  }, [user]);

  const handleAuth = async () => {
    try {
      const res = await loginUser(email, password);
      const data = await getUserData(res.user.uid);
      setUserData(data);
    } catch {
      const res = await registerUser(email, password);
      await createUserDoc(res.user.uid, email);
      alert("Cuenta creada");
    }
  };

  const handleSubscribe = async () => {
    const res = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      body: JSON.stringify({ uid: user.uid }),
    });

    const data = await res.json();
    window.location.href = data.links.find((l: any) => l.rel === "approve").href;
  };

  return (
    <main style={{ padding: 20 }}>
      {!user ? (
        <>
          <input
            placeholder="correo"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAuth}>Entrar</button>
        </>
      ) : (
        <>
          <h2>{user.email}</h2>

          {!userData?.premium ? (
            <div>
              <h3>🔥 Desbloquea PRO</h3>
              <button onClick={handleSubscribe}>
                💳 Empieza GRATIS 3 días
              </button>
            </div>
          ) : (
            <div>
              <h3>💎 PRO ACTIVO</h3>
            </div>
          )}
        </>
      )}
    </main>
  );
}