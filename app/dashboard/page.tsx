"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import { getUserData } from "../../services/userService";

export default function Dashboard() {
  const user = useAuth();

  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);
  const [peso, setPeso] = useState(0);
  const [meta, setMeta] = useState(0);

  //////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const data: any = await getUserData(user.uid);

      if (data) {
        setProgreso(data.progreso || 0);
        setRacha(data.racha || 0);
        setPeso(parseFloat(data.peso || 0));
        setMeta(parseFloat(data.meta || 0));
      }
    };

    load();
  }, [user]);

  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* PROGRESO */}
      <div style={styles.card}>
        <h3>Progreso general</h3>

        <div style={styles.progressCircle}>
          <span>{progreso.toFixed(0)}%</span>
        </div>
      </div>

      {/* RACHA */}
      <div style={styles.card}>
        <h3>🔥 Racha</h3>
        <p style={styles.big}>{racha} días</p>
      </div>

      {/* PESO */}
      <div style={styles.card}>
        <h3>⚖️ Peso</h3>
        <p>
          {peso} kg / {meta} kg
        </p>
      </div>

      {/* RESUMEN */}
      <div style={styles.card}>
        <h3>Resumen</h3>
        <p>
          Te falta {Math.max(meta - peso, 0)} kg para tu meta 💪
        </p>
      </div>

      <Navbar />
    </main>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(#020617, #0f172a)",
    color: "white",
    padding: "20px",
    paddingBottom: "80px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "bold",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },

  big: {
    fontSize: "28px",
    fontWeight: "bold",
  },

  progressCircle: {
    marginTop: "10px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "10px solid #22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
};