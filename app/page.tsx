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

  // 🔥 Detectar sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 VALIDACIÓN PRO
  const validar = () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      alert("❌ Ingresa un correo válido");
      return false;
    }

    if (password.length < 6) {
      alert("❌ La contraseña debe tener mínimo 6 caracteres");
      return false;
    }

    return true;
  };

  // 🔐 LOGIN
  const login = async () => {
    if (!validar()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Bienvenido");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("❌ Usuario no existe");
      } else if (error.code === "auth/wrong-password") {
        alert("❌ Contraseña incorrecta");
      } else {
        alert(error.message);
      }
    }
  };

  // 🆕 REGISTRO
  const register = async () => {
    if (!validar()) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Cuenta creada");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("❌ Este correo ya está registrado");
      } else {
        alert(error.message);
      }
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // ⏳ Loading
  if (loading) {
    return (
      <main style={styles.container}>
        <p style={{ color: "white" }}>Cargando...</p>
      </main>
    );
  }

  // 🔐 LOGIN UI
  if (!user) {
    return (
      <main style={styles.container}>
        <h1 style={styles.title}>🔥 FitStartPro</h1>

        <input
          type="email"
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

  // 🔥 APP PRINCIPAL
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      <p style={{ color: "white", marginBottom: "10px" }}>
        Bienvenido: {user.email}
      </p>

      <div style={styles.card}>
        <h3>🔥 Nivel PRO desbloqueado</h3>
        <p>Ya puedes guardar progreso en la nube próximamente</p>
      </div>

      <button onClick={logout} style={styles.button}>
        Cerrar sesión
      </button>
    </main>
  );
}

// 🎨 ESTILOS PRO
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
    fontSize: "28px",
  },

  input: {
    width: "260px",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    marginTop: "10px",
    fontWeight: "bold",
  },

  buttonSecondary: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    marginTop: "10px",
  },

  card: {
    background: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
    color: "white",
    textAlign: "center",
  },
};