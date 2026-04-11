export default function Home() {
  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>💪 FitStartPro</h1>

      <p>
        Tu app de rutinas y nutrición para un estilo de vida saludable
      </p>

      <div style={{ marginTop: "20px" }}>
        <button style={styles.button}>Ver Rutinas</button>
        <button style={styles.button}>Plan Nutricional</button>
      </div>
    </main>
  );
}

const styles = {
  button: {
    padding: "10px 15px",
    marginRight: "10px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};