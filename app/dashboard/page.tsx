"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import { getUserData } from "../../services/userService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const user = useAuth();

  const [data, setData] = useState<any[]>([]);
  const [racha, setRacha] = useState(0);
  const [progreso, setProgreso] = useState(0);

  //////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const userData: any = await getUserData(user.uid);

      if (userData) {
        setRacha(userData.racha || 0);
        setProgreso(userData.progreso || 0);

        // 🔥 datos simulados (puedes luego guardarlos en Firebase)
        setData([
          { dia: "Lun", peso: 70 },
          { dia: "Mar", peso: 69.5 },
          { dia: "Mié", peso: 69 },
          { dia: "Jue", peso: 68.8 },
          { dia: "Vie", peso: 68.5 },
        ]);
      }
    };

    load();
  }, [user]);

  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* 🔥 GRÁFICA */}
      <div style={styles.card}>
        <h3>Progreso de peso</h3>

        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="dia" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PROGRESO */}
      <div style={styles.card}>
        <h3>Progreso</h3>
        <p style={styles.big}>{progreso.toFixed(0)}%</p>
      </div>

      {/* RACHA */}
      <div style={styles.card}>
        <h3>🔥 Racha</h3>
        <p style={styles.big}>{racha} días</p>
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
};