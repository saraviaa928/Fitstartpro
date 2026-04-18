"use client";

import Navbar from "../../components/Navbar";

export default function Rutinas() {
  return (
    <main style={styles.container}>
      <h1>🏋️ Rutinas</h1>

      <div style={styles.card}>Push Day</div>
      <div style={styles.card}>Pull Day</div>
      <div style={styles.card}>Leg Day</div>

      <Navbar />
    </main>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    paddingBottom: "80px",
  },
  card: {
    background: "#1e293b",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px",
  },
};