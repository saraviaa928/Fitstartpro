"use client";

import Navbar from "../../components/Navbar";

export default function Perfil() {
  return (
    <main style={styles.container}>
      <h1>👤 Perfil</h1>
      <p>Próximamente...</p>

      <Navbar />
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    paddingBottom: "80px",
  },
};