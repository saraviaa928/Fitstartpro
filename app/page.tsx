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
  const [user, setUser] = useState<any>(undefined);
  const [ready, setReady] = useState(false); // 🔥 clave

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setReady(true); // 🔥 ya listo
      });

      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setReady(true);
    }
  }, []);

  // 🔥 LOADING REAL
  if (!ready) {
    return (
      <main style={styles.container}>
        <h2 style={{ color: "white", textAlign: "center" }}>
          Cargando app...
        </h2>
      </main>
    );
  }

  // 🔐 LOGIN
  if (!user) {
    return <LoginScreen />;
  }

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
    } catch (e) {
      alert("Error login");
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert("Error registro");
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

      <button onClick={login} style={styles.button}>Login</button>
      <button onClick={register} style={styles.button}>Registro</button>
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
      <p>App funcionando 🚀</p>
    </>
  );
}

//////////////////////////////////////
// 🏋️ RUTINAS (SAFE)
//////////////////////////////////////
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);

  const rutinas = [
    { dia: "Día 1", ejercicios: ["Press", "Aperturas"] },
    { dia: "Día 2", ejercicios: ["Dominadas", "Curl"] },
  ];

  // 🔥 SAFE LOAD
  useEffect(() => {
    const cargar = async () => {
      try {
        if (!auth.currentUser) return;

        const ref = doc(db, "usuarios", auth.currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCompletados(snap.data().progreso || []);
        }
      } catch (e) {
        console.error("Error cargar:", e);
      }
    };

    cargar();
  }, []);

  // 🔥 SAFE SAVE
  useEffect(() => {
    const guardar = async () => {
      try {
        if (!auth.currentUser) return;

        await setDoc(
          doc(db, "usuarios", auth.currentUser.uid),
          { progreso: completados },
          { merge: true }
        );
      } catch (e) {
        console.error("Error guardar:", e);
      }
    };

    guardar();
  }, [completados]);

  const toggle = (e: string) => {
    if (completados.includes(e)) {
      setCompletados(completados.filter((x) => x !== e));
    } else {
      setCompletados([...completados, e]);
    }
  };

  return (
    <div>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((r, i) => (
        <div key={i} style={styles.rutinaCard}>
          <h3>{r.dia}</h3>

          {r.ejercicios.map((e, idx) => (
            <p
              key={idx}
              onClick={() => toggle(e)}
              style={{
                cursor: "pointer",
                color: completados.includes(e) ? "#22c55e" : "white",
              }}
            >
              {completados.includes(e) ? "✅ " : ""}{e}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

//////////////////////////////////////
// 👤 PERFIL
//////////////////////////////////////
function PerfilScreen() {
  const guardar = async () => {
    try {
      if (!auth.currentUser) return;

      await setDoc(
        doc(db, "usuarios", auth.currentUser.uid),
        { test: true },
        { merge: true }
      );

      alert("Guardado");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>👤 Perfil</h2>
      <button onClick={guardar} style={styles.button}>
        Guardar prueba
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
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "80%",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "#22c55e",
    border: "none",
    color: "white",
  },
};