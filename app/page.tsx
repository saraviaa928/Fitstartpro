"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return null;
  if (!user) return <Login />;

  return <App user={user} />;
}

//////////////////////////////////////////
// 🔐 LOGIN
//////////////////////////////////////////

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>🔥 FitStartPro</h1>

      <input
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Contraseña"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={login} style={styles.button}>Login</button>
      <button onClick={register} style={styles.button}>Crear cuenta</button>
    </div>
  );
}

//////////////////////////////////////////
// 🏋️ APP PRO
//////////////////////////////////////////

function App({ user }: { user: User }) {
  const [completados, setCompletados] = useState<string[]>([]);
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [racha, setRacha] = useState(0);

  const rutinas = [
    {
      dia: "Día 1 - Pecho",
      ejercicios: ["Press banca", "Inclinado", "Fondos"],
    },
    {
      dia: "Día 2 - Espalda",
      ejercicios: ["Dominadas", "Remo", "Jalón"],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: ["Sentadilla", "Prensa", "Pantorrilla"],
    },
    {
      dia: "Día 4 - Hombro",
      ejercicios: ["Press militar", "Laterales", "Pájaros"],
    },
  ];

  //////////////////////////////////////////
  // 📥 CARGAR
  //////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCompletados(data.completados || []);
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setRacha(data.racha || 0);
      }
    };

    load();
  }, [user]);

  //////////////////////////////////////////
  // 💾 GUARDAR
  //////////////////////////////////////////
  useEffect(() => {
    const save = async () => {
      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          completados,
          peso,
          meta,
          racha,
        },
        { merge: true }
      );
    };

    save();
  }, [completados, peso, meta, racha, user]);

  //////////////////////////////////////////
  // 🔥 PROGRESO GLOBAL
  //////////////////////////////////////////
  const totalEjercicios = rutinas.reduce(
    (acc, r) => acc + r.ejercicios.length,
    0
  );

  const progresoGlobal = Math.round(
    (completados.length / totalEjercicios) * 100
  );

  //////////////////////////////////////////
  // 🔁 TOGGLE + RACHA
  //////////////////////////////////////////
  const toggle = (ejercicio: string) => {
    if (completados.includes(ejercicio)) {
      setCompletados(completados.filter((e) => e !== ejercicio));
    } else {
      setCompletados([...completados, ejercicio]);
      setRacha(racha + 1);
    }
  };

  return (
    <main style={styles.container}>
      <h2>👋 {user.email}</h2>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Cerrar sesión
      </button>

      {/* 📊 PROGRESO GLOBAL */}
      <div style={styles.card}>
        <h3>Progreso Total</h3>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progresoGlobal}%`,
            }}
          />
        </div>
        <p>{progresoGlobal}% completado</p>
      </div>

      {/* 🔥 RACHA */}
      <div style={styles.card}>
        <h3>🔥 Racha: {racha} días</h3>
      </div>

      {/* 👤 PERFIL */}
      <div style={styles.card}>
        <h3>Perfil</h3>
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
      </div>

      {/* 🏋️ RUTINAS */}
      {rutinas.map((r, i) => {
        const done = r.ejercicios.filter((e) =>
          completados.includes(e)
        ).length;

        const porcentaje = Math.round(
          (done / r.ejercicios.length) * 100
        );

        return (
          <div key={i} style={styles.card}>
            <h3>{r.dia}</h3>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${porcentaje}%`,
                }}
              />
            </div>

            {r.ejercicios.map((e, j) => (
              <p
                key={j}
                onClick={() => toggle(e)}
                style={{
                  cursor: "pointer",
                  color: completados.includes(e)
                    ? "#22c55e"
                    : "white",
                }}
              >
                {completados.includes(e) ? "✅ " : ""} {e}
              </p>
            ))}
          </div>
        );
      })}
    </main>
  );
}

//////////////////////////////////////////
// 🎨 ESTILOS PRO
//////////////////////////////////////////

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  input: {
    margin: "5px",
    padding: "10px",
    borderRadius: "8px",
    width: "250px",
  },
  button: {
    margin: "10px",
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    margin: "10px",
    borderRadius: "12px",
    width: "320px",
  },
  logout: {
    marginBottom: "10px",
    background: "red",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    color: "white",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#374151",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "5px",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
};