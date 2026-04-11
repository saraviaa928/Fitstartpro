export default function Home(): JSX.Element {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      <p style={styles.subtitle}>
        Tu app de rutinas y nutrición para un estilo de vida saludable
      </p>

      <div style={styles.buttonContainer}>
        <button style={styles.button}>Ver Rutinas</button>
        <button style={styles.buttonSecondary}>Plan Nutricional</button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "2.5rem",
    color: "#16a34a",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
  },
  buttonContainer: {
    marginTop: "30px",
  },
  button: {
    padding: "12px 20px",
    margin: "10px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  buttonSecondary: {
    padding: "12px 20px",
    margin: "10px",
    border: "2px solid #16a34a",
    backgroundColor: "#fff",
    color: "#16a34a",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
