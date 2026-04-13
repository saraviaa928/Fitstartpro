"use client";

import { useState, useEffect } from "react";

// ⚠️ IMPORTANTE: protegemos Firebase
let auth: any = null;
let db: any = null;

try {
  const firebase = require("../lib/firebase");
  auth = firebase.auth;
  db = firebase.db;
} catch (e) {
  console.log("Firebase no cargó:", e);
}

export default function Home() {
  const [tab, setTab] = useState("home");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setError("Firebase no está configurado correctamente");
    }
  }, []);

  // 🔥 SI HAY ERROR → mostrarlo (evita pantalla blanca)
  if (error) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <p>Revisa tu archivo /lib/firebase.ts</p>
      </div>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen />}
        {tab === "rutinas" && <RutinasScreen />}
        {tab === "nutricion" && <NutricionScreen />}
        {tab === "perfil" && <PerfilScreen />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("nutricion")} style={styles.navItem}>🍎</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

// 🏠 HOME
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido</p>
    </>
  );
}

// 🏋️ RUTINAS (SIN FIREBASE PARA EVITAR CRASH)
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem("progreso");
      if (data) setCompletados(JSON.parse(data));
    } catch (e) {
      console.log("Error localStorage:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("progreso", JSON.stringify(completados));
    } catch (e) {
      console.log("Error guardando:", e);
    }
  }, [completados]);

  const rutinas = [
    {
      dia: "Día 1",
      ejercicios: ["Press", "Fondos"],
    },
    {
      dia: "Día 2",
      ejercicios: ["Dominadas", "Remo"],
    },
  ];

  const toggle = (ej: string) => {
    if (completados.includes(ej)) {
      setCompletados(completados.filter((e) => e !== ej));
    } else {
      setCompletados([...completados, ej]);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((r, i) => (
        <div key={i} style={styles.rutinaCard}>
          <h3>{r.dia}</h3>
          <ul>
            {r.ejercicios.map((e, j) => {
              const done = completados.includes(e);
              return (
                <li
                  key={j}
                  onClick={() => toggle(e)}
                  style={{
                    cursor: "pointer",
                    textDecoration: done ? "line-through" : "none",
                    color: done ? "#22c55e" : "white",
                  }}
                >
                  {done ? "✅ " : ""}{e}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

// 🍎
function NutricionScreen() {
  return <h2>🍎 Nutrición</h2>;
}

// 👤
function PerfilScreen() {
  return <h2>👤 Perfil</h2>;
}

// 🎨
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  card: {
    padding: "20px",
    color: "white",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    background: "#111827",
    padding: "10px 0",
  },
  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },
  rutinaCard: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
  },
};