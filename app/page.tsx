"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tab, setTab] = useState("home");

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen />}
        {tab === "rutinas" && <RutinasScreen />}
        {tab === "nutricion" && <NutricionScreen />}
        {tab === "perfil" && <PerfilScreen />}
      </div>

      <nav style={styles.nav}>
        <button
          onClick={() => setTab("home")}
          style={{
            ...styles.navItem,
            color: tab === "home" ? "#22c55e" : "white",
          }}
        >
          🏠
        </button>

        <button
          onClick={() => setTab("rutinas")}
          style={{
            ...styles.navItem,
            color: tab === "rutinas" ? "#22c55e" : "white",
          }}
        >
          🏋️
        </button>

        <button
          onClick={() => setTab("nutricion")}
          style={{
            ...styles.navItem,
            color: tab === "nutricion" ? "#22c55e" : "white",
          }}
        >
          🍎
        </button>

        <button
          onClick={() => setTab("perfil")}
          style={{
            ...styles.navItem,
            color: tab === "perfil" ? "#22c55e" : "white",
          }}
        >
          👤
        </button>
      </nav>
    </main>
  );
}

// 🏠 Home
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido a tu app fitness</p>
    </>
  );
}

// 🏋️ Rutinas
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("progreso");
    if (data) setCompletados(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("progreso", JSON.stringify(completados));
  }, [completados]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho y Tríceps",
      ejercicios: [
        "Press banca - 4x10",
        "Press inclinado - 3x10",
        "Aperturas - 3x12",
      ],
    },
    {
      dia: "Día 2 - Espalda y Bíceps",
      ejercicios: [
        "Dominadas - 4x8",
        "Remo con barra - 4x10",
        "Curl bíceps - 3x12",
      ],
    },
  ];

  const toggleEjercicio = (ejercicio: string) => {
    if (completados.includes(ejercicio)) {
      setCompletados(completados.filter((e) => e !== ejercicio));
    } else {
      setCompletados([...completados, ejercicio]);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((rutina, index) => {
        const completadosDia = rutina.ejercicios.filter((e) =>
          completados.includes(e)
        ).length;

        const total = rutina.ejercicios.length;
        const porcentaje = Math.round((completadosDia / total) * 100);

        return (
          <div key={index} style={styles.rutinaCard}>
            <h3>{rutina.dia}</h3>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${porcentaje}%`,
                }}
              />
            </div>

            <p style={{ fontSize: "12px" }}>
              {porcentaje}% completado
            </p>

            <ul>
              {rutina.ejercicios.map((ejercicio, i) => {
                const isDone = completados.includes(ejercicio);

                return (
                  <li
                    key={i}
                    onClick={() => toggleEjercicio(ejercicio)}
                    style={{
                      cursor: "pointer",
                      textDecoration: isDone ? "line-through" : "none",
                      color: isDone ? "#22c55e" : "white",
                    }}
                  >
                    {isDone ? "✅ " : ""}{ejercicio}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// 🍎 Nutrición
function NutricionScreen() {
  return (
    <>
      <h2>🍎 Nutrición</h2>
      <p>Planes próximamente</p>
    </>
  );
}

// 👤 Perfil
function PerfilScreen() {
  return (
    <>
      <h2>👤 Perfil</h2>
      <p>Tu progreso</p>
    </>
  );
}

// 🎨 Estilos
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
};