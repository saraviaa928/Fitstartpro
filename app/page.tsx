"use client";

import { useState, useEffect } from "react";

let auth: any = null;
let db: any = null;

try {
  const firebase = require("../lib/firebase");
  auth = firebase.auth;
  db = firebase.db;
} catch (e) {
  console.log("Firebase error:", e);
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const { onAuthStateChanged } = require("firebase/auth");

    const unsub = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <p style={{ color: "white" }}>Cargando...</p>;
  }

  if (!user) {
    return <AuthScreen setUser={setUser} />;
  }

  return <App user={user} />;
}

//////////////////////////////////////////////////
// 🔐 LOGIN / REGISTER
//////////////////////////////////////////////////

function AuthScreen({ setUser }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const { signInWithEmailAndPassword } = require("firebase/auth");
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (e) {
      alert("Error login");
    }
  };

  const register = async () => {
    try {
      const { createUserWithEmailAndPassword } = require("firebase/auth");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (e) {
      alert("Error registro");
    }
  };

  return (
    <div style={styles.center}>
      <h2>🔐 FitStartPro</h2>

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

      <button onClick={login} style={styles.button}>Login</button>
      <button onClick={register} style={styles.button}>Registrarse</button>
    </div>
  );
}

//////////////////////////////////////////////////
// 📱 APP PRINCIPAL
//////////////////////////////////////////////////

function App({ user }: any) {
  const [tab, setTab] = useState("home");

  const logout = async () => {
    const { signOut } = require("firebase/auth");
    await signOut(auth);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen />}
        {tab === "rutinas" && <RutinasScreen user={user} />}
        {tab === "perfil" && <PerfilScreen user={user} logout={logout} />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

//////////////////////////////////////////////////
// 🏠 HOME
//////////////////////////////////////////////////

function HomeScreen() {
  return <h1>💪 Bienvenido a FitStartPro</h1>;
}

//////////////////////////////////////////////////
// 🏋️ RUTINAS CON FIREBASE
//////////////////////////////////////////////////

function RutinasScreen({ user }: any) {
  const [completados, setCompletados] = useState<string[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { doc, getDoc } = require("firebase/firestore");
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCompletados(snap.data().progreso || []);
        }
      } catch (e) {
        console.log("Error cargar:", e);
      }
    };

    cargar();
  }, [user]);

  useEffect(() => {
    const guardar = async () => {
      try {
        const { doc, setDoc } = require("firebase/firestore");
        await setDoc(
          doc(db, "usuarios", user.uid),
          { progreso: completados },
          { merge: true }
        );
      } catch (e) {
        console.log("Error guardar:", e);
      }
    };

    guardar();
  }, [completados, user]);

  const rutinas = [
    { dia: "Día 1", ejercicios: ["Press", "Fondos"] },
    { dia: "Día 2", ejercicios: ["Dominadas", "Remo"] },
    { dia: "Día 3", ejercicios: ["Pierna", "Prensa"] },
  ];

  const toggle = (ej: string) => {
    if (completados.includes(ej)) {
      setCompletados(completados.filter((e) => e !== ej));
    } else {
      setCompletados([...completados, ej]);
    }
  };

  return (
    <div>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((r, i) => (
        <div key={i}>
          <h3>{r.dia}</h3>
          {r.ejercicios.map((e, j) => {
            const done = completados.includes(e);
            return (
              <p
                key={j}
                onClick={() => toggle(e)}
                style={{
                  cursor: "pointer",
                  textDecoration: done ? "line-through" : "none",
                  color: done ? "green" : "white",
                }}
              >
                {e}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}

//////////////////////////////////////////////////
// 👤 PERFIL
//////////////////////////////////////////////////

function PerfilScreen({ user, logout }: any) {
  return (
    <div>
      <h2>👤 Perfil</h2>
      <p>{user.email}</p>
      <button onClick={logout} style={styles.button}>
        Cerrar sesión
      </button>
    </div>
  );
}

//////////////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////////////

const styles: any = {
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
  center: {
    color: "white",
    textAlign: "center",
    marginTop: "100px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "80%",
  },
  button: {
    margin: "5px",
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: "8px",
  },
};