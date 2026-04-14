"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("home");

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

  // 🔥 VALIDACIÓN
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
      alert(error.message);
    }
  };

  // 🆕 REGISTRO
  const register = async () => {
    if (!validar()) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Cuenta creada");
    } catch (error: any) {
      alert(error.message);
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
      <div style={styles.card}>
        {tab === "home" && <HomeScreen user={user} />}
        {tab === "rutinas" && <RutinasScreen user={user} />}
        {tab === "perfil" && <PerfilScreen user={user} />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

// 🏠 HOME
function HomeScreen({ user }: any) {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido: {user.email}</p>
    </>
  );
}

// 🏋️ RUTINAS CON FIREBASE
function RutinasScreen({ user }: any) {
  const [completados, setCompletados] = useState<string[]>([]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho",
      ejercicios: ["Press banca", "Aperturas"],
    },
    {
      dia: "Día 2 - Espalda",
      ejercicios: ["Dominadas", "Remo"],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: ["Sentadillas", "Prensa"],
    },
  ];

  // 🔥 CARGAR
  useEffect(() => {
    const cargar = async () => {
      if (!user) return;

      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCompletados(snap.data().completados || []);
      }
    };

    cargar();
  }, [user]);

  // 🔥 GUARDAR
  useEffect(() => {
    const guardar = async () => {
      if (!user) return;

      const ref = doc(db, "usuarios", user.uid);

      await setDoc(ref, { completados }, { merge: true });
    };

    guardar();
  }, [completados, user]);

  const toggleEjercicio = (ejercicio: string) => {
    if (completados.includes(ejercicio)) {
      setCompletados(completados.filter((e) => e !== ejercicio));
    } else {
      setCompletados([...completados, ejercicio]);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((r, i) => (
        <div key={i} style={styles.rutinaCard}>
          <h3>{r.dia}</h3>

          <ul>
            {r.ejercicios.map((e, j) => {
              const done = completados.includes(e);

              return (
                <li
                  key={j}
                  onClick={() => toggleEjercicio(e)}
                  style={{
                    cursor: "pointer",
                    textDecoration: done ? "line-through" : "none",
                    color: done ? "#22c55e" : "white",
                  }}
                >
                  {done ? "✅ " : ""} {e}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

// 👤 PERFIL
function PerfilScreen({ user }: any) {
  return (
    <>
      <h2>👤 Perfil</h2>
      <p>{user.email}</p>
    </>
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
  },

  card: {
    padding: "20px",
    color: "white",
    textAlign: "center",
  },

  nav: {
    display: "flex",
    justifyContent: "space-around",
    background: "#111827",
    padding: "10px 0",
  },

  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },

  rutinaCard: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
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