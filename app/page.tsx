"use client";

import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Detectar sesión activa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Bienvenido");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // 🔥 CREAR CUENTA
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Cuenta creada");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // 🔥 LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // ⏳ Loading (evita pantalla blanca)
  if (loading) {
    return (
      <main style={styles.container}>
        <p style={{ color: "white" }}>Cargando...</p>
      </main>
    );
  }

  // 🔐 SI NO ESTÁ LOGUEADO → LOGIN SCREEN
  if (!user) {
    return (
      <main style={styles.container}>
        <h1 style={styles.title}>🔥 FitStartPro</h1>

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
          Login
        </button>

        <button onClick={register} style={styles.buttonSecondary}>
          Crear cuenta
        </button>
      </main>
    );
  }

  // 🔥 APP PRINCIPAL (YA LOGUEADO)
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      <p style={{ color: "white" }}>
        Bienvenido: {user.email}
      </p>

      <button onClick={logout} style={styles.button}>
        Cerrar sesión
      </button>
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
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    marginBottom: "20px",
  },

  input: {
    width: "250px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    marginTop: "10px",
  },

  buttonSecondary: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    marginTop: "10px",
  },
};