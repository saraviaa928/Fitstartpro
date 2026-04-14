"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Escuchar sesión
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error auth:", error);
      setLoading(false);
    }
  }, []);

  // 🔥 Evita pantalla blanca mientras carga
  if (loading) {
    return (
      <main style={styles.center}>
        <h2>Cargando...</h2>
      </main>
    );
  }

  // 🔥 Si no hay usuario → login
  if (!user) {
    return <LoginScreen />;
  }

  // 🔥 Si hay usuario → app
  return <AppScreen user={user} />;
}

// 🔐 LOGIN
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <main style={styles.center}>
      <h1>🔥 FitStartPro</h1>

      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={login} style={styles.button}>
        Iniciar sesión
      </button>
    </main>
  );
}

// 📱 APP PRINCIPAL
function AppScreen({ user }: any) {
  const [tab, setTab] = useState("home");

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <h2>Bienvenido {user.email}</h2>}
        {tab === "rutinas" && <h2>Rutinas</h2>}
        {tab === "perfil" && (
          <>
            <h2>Perfil</h2>
            <button onClick={() => signOut(auth)} style={styles.button}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

// 🎨 ESTILOS
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "white",
  },
  card: {
    padding: "20px",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    background: "#111827",
    padding: "10px",
  },
  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },
  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  input: {
    margin: "10px",
    padding: "10px",
    width: "200px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};