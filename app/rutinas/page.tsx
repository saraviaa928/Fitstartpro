"use client";

import { useState } from "react";

type Rutina = {
  nombre: string;
  ejercicios: { nombre: string; sets: number; reps: string }[];
};

const rutinas: Record<string, Rutina> = {
  push: {
    nombre: "Push (Pecho, Hombro, Tríceps)",
    ejercicios: [
      { nombre: "Press banca", sets: 4, reps: "8-12" },
      { nombre: "Press inclinado", sets: 3, reps: "8-12" },
      { nombre: "Elevaciones laterales", sets: 3, reps: "12-15" },
      { nombre: "Fondos", sets: 3, reps: "8-10" },
      { nombre: "Extensión tríceps", sets: 3, reps: "10-12" },
    ],
  },
  pull: {
    nombre: "Pull (Espalda, Bíceps)",
    ejercicios: [
      { nombre: "Dominadas", sets: 4, reps: "6-10" },
      { nombre: "Remo con barra", sets: 4, reps: "8-12" },
      { nombre: "Jalón al pecho", sets: 3, reps: "10-12" },
      { nombre: "Curl bíceps", sets: 3, reps: "10-12" },
      { nombre: "Face pull", sets: 3, reps: "12-15" },
    ],
  },
  legs: {
    nombre: "Legs (Piernas)",
    ejercicios: [
      { nombre: "Sentadilla", sets: 4, reps: "6-10" },
      { nombre: "Prensa", sets: 4, reps: "10-12" },
      { nombre: "Peso muerto", sets: 3, reps: "6-10" },
      { nombre: "Curl femoral", sets: 3, reps: "10-12" },
      { nombre: "Pantorrillas", sets: 4, reps: "12-15" },
    ],
  },
};

export default function RutinasPage() {
  const [dia, setDia] = useState<"push" | "pull" | "legs">("push");

  const rutina = rutinas[dia];

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🏋️ Rutinas</h1>

      {/* SELECTOR DE DÍAS */}
      <div style={styles.tabs}>
        <button
          style={dia === "push" ? styles.activeTab : styles.tab}
          onClick={() => setDia("push")}
        >
          Push
        </button>

        <button
          style={dia === "pull" ? styles.activeTab : styles.tab}
          onClick={() => setDia("pull")}
        >
          Pull
        </button>

        <button
          style={dia === "legs" ? styles.activeTab : styles.tab}
          onClick={() => setDia("legs")}
        >
          Legs
        </button>
      </div>

      {/* TÍTULO */}
      <div style={styles.card}>
        <h2>{rutina.nombre}</h2>
      </div>

      {/* EJERCICIOS */}
      {rutina.ejercicios.map((ej, i) => (
        <div key={i} style={styles.exercise}>
          <div>
            <p style={styles.exerciseName}>{ej.nombre}</p>
            <small>
              {ej.sets} series • {ej.reps} reps
            </small>
          </div>

          <button style={styles.startBtn}>▶</button>
        </div>
      ))}
    </main>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(#020617, #0f172a)",
    color: "white",
    padding: "20px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
    border: "none",
  },

  activeTab: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    background: "#22c55e",
    color: "black",
    border: "none",
    fontWeight: "bold",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  exercise: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  exerciseName: {
    fontWeight: "bold",
  },

  startBtn: {
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "black",
    fontWeight: "bold",
  },
};