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
          style={{ ...styles.navItem, color: tab === "home" ? "#22c55e" : "white" }}
        >
          🏠
        </button>

        <button
          onClick={() => setTab("rutinas")}
          style={{ ...styles.navItem, color: tab === "rutinas" ? "#22c55e" : "white" }}
        >
          🏋️
        </button>

        <button
          onClick={() => setTab("nutricion")}
          style={{ ...styles.navItem, color: tab === "nutricion" ? "#22c55e" : "white" }}
        >
          🍎
        </button>

        <button
          onClick={() => setTab("perfil")}
          style={{ ...styles.navItem, color: tab === "perfil" ? "#22c55e" : "white" }}
        >
          👤
        </button>
      </nav>
    </main>
  );
}

// 🏠 HOME
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido a tu app fitness</p>

      <button style={styles.proButton}>
        🚀 Obtener versión PRO
      </button>
    </>
  );
}

// 🏋️ RUTINAS
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);
  const [racha, setRacha] = useState(0);

  // 🔥 Cargar datos
  useEffect(() => {
    const data = localStorage.getItem("progreso");
    if (data) setCompletados(JSON.parse(data));

    const r = localStorage.getItem("racha");
    if (r) setRacha(parseInt(r));
  }, []);

  // 🔥 Guardar progreso + racha
  useEffect(() => {
    localStorage.setItem("progreso", JSON.stringify(completados));

    const hoy = new Date().toDateString();
    const ultimaFecha = localStorage.getItem("ultima_fecha");

    if (ultimaFecha !== hoy && completados.length > 0) {
      const nuevaRacha = racha + 1;
      setRacha(nuevaRacha);
      localStorage.setItem("racha", nuevaRacha.toString());
      localStorage.setItem("ultima_fecha", hoy);
    }
  }, [completados]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho y Tríceps",
      ejercicios: [
        "Press banca - 4x10",
        "Press inclinado - 3x10",
        "Aperturas - 3x12",
        "Fondos - 3x10",
        "Extensión tríceps - 3x12",
      ],
    },
    {
      dia: "Día 2 - Espalda y Bíceps",
      ejercicios: [
        "Dominadas - 4x8",
        "Remo con barra - 4x10",
        "Jalón al pecho - 3x12",
        "Curl bíceps - 3x12",
        "Curl martillo - 3x10",
      ],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: [
        "Sentadillas - 4x10",
        "Prensa - 4x12",
        "Peso muerto - 3x10",
        "Extensión pierna - 3x12",
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

  // 🔥 PROGRESO GLOBAL
  const totalEjercicios = rutinas.reduce(
    (acc, r) => acc + r.ejercicios.length,
    0
  );

  const totalCompletados = completados.length;

  const progresoGlobal = Math.round(
    (totalCompletados / totalEjercicios) * 100
  );

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

      {/* 🔥 PROGRESO GLOBAL */}
      <div style={styles.globalCard}>
        <p>Progreso total</p>

        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progresoGlobal}%`,
            }}
          />
        </div>

        <p>{progresoGlobal}% completado</p>
        <p style={{ color: "#facc15" }}>🔥 Racha: {racha} días</p>
      </div>

      {rutinas.map((rutina, index) => {
        const completados