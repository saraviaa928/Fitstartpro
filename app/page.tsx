"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Detectar usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Evita pantalla blanca
  if (loading) {
    return <p style={{ color: "white" }}>Cargando...</p>;
  }

  // 🔐 Si no hay usuario
  if (!user) {
    return (
      <div style={styles.center}>
        <h2>🔐 Inicia sesión</h2>
        <p>Debes iniciar sesión para usar la app</p>
      </div>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen />}
        {tab === "rutinas" && <RutinasScreen user={user} />}
        {tab === "nutricion" && <NutricionScreen />}
        {tab === "perfil" && <PerfilScreen user={user} />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={{ ...styles.navItem, color: tab === "home" ? "#22c55e" : "white" }}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={{ ...styles.navItem, color: tab === "rutinas" ? "#22c55e" : "white" }}>🏋️</button>
        <button onClick={() => setTab("nutricion")} style={{ ...styles.navItem, color: tab === "nutricion" ? "#22c55e" : "white" }}>🍎</button>
        <button onClick={() => setTab("perfil")} style={{ ...styles.navItem, color: tab === "perfil" ? "#22c55e" : "white" }}>👤</button>
      </nav>
    </main>
  );
}

// 🏠 HOME
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Tu progreso fitness en una sola app</p>
    </>
  );
}

// 🏋️ RUTINAS
function RutinasScreen({ user }: any) {
  const [completados, setCompletados] = useState<string[]>([]);

  // 🔥 Cargar desde Firebase
  useEffect(() => {
    const cargar = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCompletados(snap.data().progreso || []);
        }
      } catch (error) {
        console.log("Error cargando progreso:", error);
      }
    };

    cargar();
  }, [user]);

  // 🔥 Guardar en Firebase
  useEffect(() => {
    const guardar = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        await setDoc(ref, { progreso: completados }, { merge: true });
      } catch (error) {
        console.log("Error guardando progreso:", error);
      }
    };

    guardar();
  }, [completados, user]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho",
      ejercicios: ["Press banca", "Press inclinado", "Fondos"],
    },
    {
      dia: "Día 2 - Espalda",
      ejercicios: ["Dominadas", "Remo", "Jalón"],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: ["Sentadilla", "Prensa", "Peso muerto"],
    },
    {
      dia: "Día 4 - Hombro",
      ejercicios: ["Press militar", "Laterales", "Pájaros"],
    },
  ];

  const toggle = (ej: string) => {
    if (completados.includes(ej)) {
      setCompletados(completados.filter((e) => e !== ej));
    } else {
      setCompletados([...completados, ej]);
    }
  };

  const totalEjercicios = rutinas.reduce((acc, r) => acc + r.ejercicios.length, 0);
  const progresoGlobal = Math.round((completados.length / totalEjercicios) * 100);

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {/* 🔥 PROGRESO GLOBAL */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progresoGlobal}%` }} />
      </div>
      <p>{progresoGlobal}% progreso total</p>

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

// 🍎 NUTRICIÓN
function NutricionScreen() {
  return (
    <>
      <h2>🍎 Nutrición</h2>
      <p>Próximamente</p>
    </>
  );
}

// 👤 PERFIL
function PerfilScreen({ user }: any) {
  return (
    <>
      <h2>👤 Perfil</h2>
      <p>{user?.email}</p>
    </>
  );
}

// 🎨 ESTILOS
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
    fontSize: "20px",
  },
  rutinaCard: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#374151",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "5px",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  center: {
    color: "white",
    textAlign: "center",
    marginTop: "50px",
  },
};