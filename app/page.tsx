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
