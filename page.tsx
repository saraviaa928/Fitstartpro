import React from "react";

export default function Home() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      <p style={styles.subtitle}>
        Tu app de rutinas y nutrición para un estilo de vida saludable
      </p>

      <div style={styles.card}>
        <h2>🔥 Rutinas</h2>
        <p>Entrenamientos para todos los niveles</p>
      </div>

      <div style={styles.card}>
        <h2>🥗 Nutrición</h2>
        <p>Planes alimenticios para tus objetivos</p>
      </div>

      <div style={styles.card}>
        <h2>📈 Progreso</h2>
        <p>Monitorea tu avance y mejora cada día</p>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#94a3b8",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    width: "100%",
    maxWidth: "300px",
  },
};
