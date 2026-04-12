import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>💪 FitStartPro</h1>
      <p>Tu app fitness</p>

      <div style={{ marginTop: 20 }}>
        <Link href="/rutinas">
          <button style={styles.button}>Rutinas</button>
        </Link>

        <Link href="/nutricion">
          <button style={styles.button}>Nutrición</button>
        </Link>
      </div>
    </main>
  );
}

const styles = {
  button: {
    padding: "12px 20px",
    margin: "10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
};