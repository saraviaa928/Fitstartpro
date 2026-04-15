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

      <input placeholder="Correo" onChange={(e) => setEmail(e.target.value)} style={styles.input}/>
      <input placeholder="Contraseña" type="password" onChange={(e) => setPassword(e.target.value)} style={styles.input}/>

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
  const [isPro, setIsPro] = useState(false);

  const rutinas = [
    { dia: "Día 1 - Pecho", ejercicios: ["Press banca", "Inclinado", "Fondos"] },
    { dia: "Día 2 - Espalda", ejercicios: ["Dominadas", "Remo", "Jalón"] },
    { dia: "Día 3 - Pierna", ejercicios: ["Sentadilla", "Prensa", "Pantorrilla"] },
    { dia: "Día 4 - Hombro", ejercicios: ["Press militar", "Laterales", "Pájaros"] },
  ];

  //////////////////////////////////////////
  // 📥 CARGAR
  //////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "usuarios", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setCompletados(data.completados || []);
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setRacha(data.racha || 0);
        setIsPro(data.pro || false);
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
        { completados, peso, meta, racha, pro: isPro },
        { merge: true }
      );
    };
    save();
  }, [completados, peso, meta, racha, isPro, user]);

  //////////////////////////////////////////
  // 📊 PROGRESO GLOBAL
  //////////////////////////////////////////
  const totalEjercicios = rutinas.reduce((acc, r) => acc + r.ejercicios.length, 0);
  const progresoGlobal = Math.round((completados.length / totalEjercicios) * 100);

  //////////////////////////////////////////
  const toggle = (e: string) => {
    if (completados.includes(e)) {
      setCompletados(completados.filter((x) => x !== e));
    } else {
      setCompletados([...completados, e]);
      setRacha(racha + 1);
    }
  };

  return (
    <main style={styles.container}>
      <h2>👋 {user.email}</h2>
      <button onClick={() => signOut(auth)} style={styles.logout}>Cerrar sesión</button>

      {/* 💎 PRO */}
      <div style={styles.card}>
        <h3>💎 Versión PRO</h3>
        {isPro ? (
          <p style={{ color: "#22c55e" }}>Activo ✅</p>
        ) : (
          <button style={styles.button} onClick={() => setIsPro(true)}>
            Activar PRO
          </button>
        )}
      </div>

      {/* 📊 PROGRESO */}
      <div style={styles.card}>
        <h3>Progreso Total</h3>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progresoGlobal}%` }}/>
        </div>
        <p>{progresoGlobal}%</p>
      </div>

      {/* 🔥 RACHA */}
      <div style={styles.card}>
        <h3>🔥 Racha: {racha}</h3>
      </div>

      {/* 👤 PERFIL */}
      <div style={styles.card}>
        <input placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} style={styles.input}/>
        <input placeholder="Meta" value={meta} onChange={(e) => setMeta(e.target.value)} style={styles.input}/>
      </div>

      {/* 🏋️ RUTINAS */}
      {rutinas.map((r, i) => {
        const bloqueado = !isPro && i >= 2;

        return (
          <div key={i} style={styles.card}>
            <h3>{r.dia}</h3>

            {bloqueado ? (
              <p style={{ color: "gray" }}>🔒 Solo PRO</p>
            ) : (
              r.ejercicios.map((e, j) => (
                <p key={j} onClick={() => toggle(e)} style={{ cursor: "pointer" }}>
                  {completados.includes(e) ? "✅ " : ""}{e}
                </p>
              ))
            )}
          </div>
        );
      })}
    </main>
  );
}

//////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////

const styles: any = {
  container: { minHeight: "100vh", background: "#0f172a", color: "white", padding: "20px", textAlign: "center" },
  input: { margin: "5px", padding: "10px", borderRadius: "8px" },
  button: { margin: "10px", padding: "10px", background: "#22c55e", border: "none", borderRadius: "8px", color: "white" },
  card: { background: "#1f2937", padding: "15px", margin: "10px", borderRadius: "10px" },
  logout: { background: "red", padding: "8px", border: "none", color: "white" },
  progressBar: { width: "100%", height: "8px", background: "#374151", borderRadius: "10px" },
  progressFill: { height: "100%", background: "#22c55e" },
};