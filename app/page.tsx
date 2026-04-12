export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💪 FitStartPro</h1>
        <p style={styles.subtitle}>
          Tu app de rutinas y nutrición para un estilo de vida saludable
        </p>

        <div style={styles.grid}>
          <div style={styles.box}>
            🏋️‍♂️ Rutinas
          </div>
          <div style={styles.box}>
            🍎 Nutrición
          </div>
          <div style={styles.box}>
            📊 Progreso
          </div>
          <div style={styles.box}>
            ⚙️ Ajustes
          </div>
        </div>

        <button style={styles.button}>
          Empezar entrenamiento 🚀
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "20px",
  },
  card: {
    backgroundColor: "#111827",
    padding: "25px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  box: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "black",
    fontWeight: "bold",
    cursor: "pointer",
  },
};