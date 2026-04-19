"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { loginUser, registerUser } from "@/services/authService";
import {
  createUserDoc,
  getUserData,
  updateUserData,
} from "@/services/userService";

export default function Home() {
  const user = useAuth();

  const [userData, setUserData]: any = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);

  //////////////////////////////////////////
  // LOGIN / REGISTER
  //////////////////////////////////////////
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

  //////////////////////////////////////////
  // CARGAR DATOS
  //////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const data: any = await getUserData(user.uid);

      if (data) {
        setUserData(data);
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setProgreso(data.progreso || 0);
        setRacha(data.racha || 0);
      }
    };

    load();
  }, [user]);

  //////////////////////////////////////////
  // GUARDAR
  //////////////////////////////////////////
  const guardar = async () => {
    if (!user) return;

    const pesoNum = parseFloat(peso);
    const metaNum = parseFloat(meta);

    if (isNaN(pesoNum) || isNaN(metaNum)) {
      alert("Valores inválidos");
      return;
    }

    const nuevo = Math.min((pesoNum / metaNum) * 100, 100);

    await updateUserData(user.uid, {
      peso,
      meta,
      progreso: nuevo,
      racha: racha + 1,
    });

    setProgreso(nuevo);
    setRacha(racha + 1);
  };

  //////////////////////////////////////////
  // PAYPAL
  //////////////////////////////////////////
  const handleSubscribe = async () => {
    if (!user) {
      alert("Inicia sesión");
      return;
    }

    const res = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: user.uid }),
    });

    const data = await res.json();

    const link = data.links?.find((l: any) => l.rel === "approve");

    if (!link) {
      alert("Error PayPal");
      return;
    }

    window.location.href = link.href;
  };

  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      {!user ? (
        <div style={styles.card}>
          <h2>Login</h2>

          <input
            style={styles.input}
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.btn} onClick={handleAuth}>
            Entrar
          </button>
        </div>
      ) : (
        <>
          <div style={styles.card}>
            <p>👋 {user.email}</p>
          </div>

          {/* 🔥 PAYWALL */}
          {!userData?.premium && (
            <div style={styles.card}>
              <h3>🔥 Desbloquea PRO</h3>
              <p>Rutinas + nutrición + seguimiento completo</p>

              <button style={styles.btnPremium} onClick={handleSubscribe}>
                💳 Empieza GRATIS 3 días
              </button>
            </div>
          )}

          {/* ✅ CONTENIDO (SIEMPRE VISIBLE PERO LIMITADO) */}
          <div style={styles.card}>
            <h3>📊 Progreso</h3>
            <div style={styles.bar}>
              <div
                style={{
                  ...styles.fill,
                  width: `${progreso}%`,
                }}
              />
            </div>
            <p>{progreso.toFixed(0)}%</p>
          </div>

          <div style={styles.card}>
            <h3>🔥 Racha</h3>
            <p style={styles.big}>{racha} días</p>
          </div>

          <div style={styles.card}>
            <input
              style={styles.input}
              placeholder="Peso"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Meta"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />

            <button style={styles.btn} onClick={guardar}>
              Guardar progreso
            </button>
          </div>
        </>
      )}
    </main>
  );
}

//////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: "20px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
  },

  btn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    color: "white",
  },

  btnPremium: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#f59e0b",
    border: "none",
    borderRadius: "10px",
    color: "black",
    fontWeight: "bold",
  },

  bar: {
    height: "10px",
    background: "#334155",
    borderRadius: "10px",
    marginTop: "10px",
  },

  fill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "10px",
  },

  big: {
    fontSize: "26px",
  },
};