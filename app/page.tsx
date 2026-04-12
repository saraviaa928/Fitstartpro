"use client";
import { useState } from "react";

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
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("nutricion")} style={styles.navItem}>🍎</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

// 🔹 Pantallas
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido a tu app fitness</p>
    </>
  );
}

function RutinasScreen() {
  const rutinas = [
    {
      dia: "Día 1 - Pecho y Tríceps",
      ejercicios: [
        "Press banca - 4x10",
        "Press inclinado - 3x10",
        "Aperturas con mancuernas - 3x12",
        "Fondos - 3x10",
        "Extensión de tríceps - 3x12",
      ],
    },
    {
      dia: "Día 2 - Espalda y Bíceps",
      ejercicios: [
        "Dominadas - 4x8",
        "Remo con barra - 4x10",
        "Jalón al pecho - 3x12",
        "Curl de bíceps - 3x12",
        "Curl martillo - 3x10",
      ],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: [
        "Sentadillas - 4x10",
        "Prensa - 4x12",
        "Peso muerto - 3x10",
        "Extensión de pierna - 3x12",
        "Pantorrillas - 4x15",
      ],
    },
    {
      dia: "Día 4 - Hombro",
      ejercicios: [
        "Press militar - 4x10",
        "Elevaciones laterales - 3x12",
        "Elevaciones frontales - 3x12",
        "Pájaros - 3x12",
        "Encogimientos - 3x15",
      ],
    },
  ];

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((rutina, index) => (
        <div key={index} style={styles.rutinaCard}>
          <h3>{rutina.dia}</h3>
          <ul>
            {rutina.ejercicios.map((ejercicio, i) => (
              <li key={i}>{ejercicio}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
  return (
    <>
      <h2>🏋️ Rutinas</h2>
      <p>Próximamente rutinas personalizadas</p>
    </>
  );
}

function NutricionScreen() {
  return (
    <>
      <h2>🍎 Nutrición</h2>
      <p>Planes de dieta en camino</p>
    </>
  );
}

function PerfilScreen() {
  return (
    <>
      <h2>👤 Perfil</h2>
      <p>Tu progreso y datos</p>
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
    borderTop: "1px solid #1f2937",
  },
  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },
};rutinaCard: {
  backgroundColor: "#1f2937",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px",
},
