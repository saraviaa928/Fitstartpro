"use client";
import { useState, useEffect } from "react";

// 🔥 Firebase
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [tab, setTab] = useState("home");

  // 🔥 IMPORTANTE (solución pantalla blanca)
  const [user, setUser] = useState<any>(undefined);

  // 🔐 Detectar usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Loading (evita pantalla blanca)
  if (user === undefined) {
    return (
      <main style={styles.container}>
        <p style={{ color: "white", textAlign: "center" }}>
          Cargando...
        </p>
      </main>
    );
  }

  // 🔐 Si no hay usuario → login
  if (!user) return <LoginScreen />;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen />}
        {tab === "rutinas" && <RutinasScreen />}
        {tab === "perfil" && <PerfilScreen />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
        <button onClick={() => signOut(auth)} style={styles.navItem}>🚪</button>
      </nav>
    </main>
  );
}

//////////////////////////////////////
// 🔐 LOGIN
//////////////////////////////////////
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Error al iniciar sesión");
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Error al registrarse");
    }
  };

  return (
    <div style={styles.card}>
      <h2>🔥 FitStartPro</h2>

      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={login} style={styles.button}>
        Iniciar sesión
      </button>

      <button onClick={register} style={styles.button}>
        Registrarse
      </button>
    </div>
  );
}

//////////////////////////////////////
// 🏠 HOME
//////////////////////////////////////
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Tu progreso ahora se guarda en la nube ☁️</p>
    </>
  );
}

//////////////////////////////////////
// 🏋️ RUTINAS
//////////////////////////////////////
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);

  const rutinas = [
    {
      dia: "Día 1",
      ejercicios: ["Press banca", "Aperturas", "Fondos"],
    },
    {
      dia: "Día 2",
      ejercicios: ["Dominadas", "Remo", "Curl bíceps"],
    },
  ];

  // 🔥 Cargar desde Firebase
  useEffect(() => {
    const cargar = async () => {
      if (!auth.currentUser) return;

      const ref = doc(db, "usuarios", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCompletados(snap.data().progreso || []);
      }
    };

    cargar();
  }, []);

  // 🔥 Guardar en Firebase
  useEffect(() => {
    const guardar = async () => {
      if (!auth.currentUser) return;

      await setDoc(
        doc(db, "usuarios", auth.currentUser.uid),
        { progreso: completados },
        { merge: true }
      );
    };

    guardar();
  }, [completados]);

  const toggleEjercicio = (ejercicio: string) => {
    if (completados.includes(ejercicio)) {
      setCompletados(completados.filter((e) => e !== ejercicio));
    } else {
      setCompletados([...completados, ejercicio]);
    }
  };

  return (
    <div>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((r, i) => (
        <div key={i} style={styles.rutinaCard}>
          <h3>{r.dia}</h3>

          <ul>
            {r.ejercicios.map((e, idx) => {
              const done = completados.includes(e);

              return (
                <li
                  key={idx}
                  onClick={() => toggleEjercicio(e)}
                  style={{
                    cursor: "pointer",
                    textDecoration: done ? "line-through" : "none",
                    color: done ? "#22c55e" : "white",
                  }}
                >
                  {done ? "✅ " : ""}{e}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

//////////////////////////////////////
// 👤 PERFIL
//////////////////////////////////////
function PerfilScreen() {
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");

  const guardarPerfil = async () => {
    if (!auth.currentUser) return;

    await setDoc(
      doc(db, "usuarios", auth.currentUser.uid),
      { peso, meta },
      { merge: true }
    );

    alert("Perfil guardado ✅");
  };

  return (
    <div>
      <h2>👤 Perfil</h2>

      <input
        placeholder="Peso"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Meta"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        style={styles.input}
      />

      <button onClick={guardarPerfil} style={styles.button}>
        Guardar perfil
      </button>
    </div>
  );
}

//////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////
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
    padding: "10px",
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
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "80%",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
    width: "80%",
  },
}; 