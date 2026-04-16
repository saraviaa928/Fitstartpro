"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [racha, setRacha] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [pro, setPro] = useState(false);

  //////////////////////////////////////////
  // 🔐 DETECTAR SESIÓN
  //////////////////////////////////////////
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        const ref = doc(db, "usuarios", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setPeso(data.peso || "");
          setMeta(data.meta || "");
          setRacha(data.racha || 0);
          setProgreso(data.progreso || 0);
          setPro(data.pro || false);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // 🔑 LOGIN CORREGIDO
  //////////////////////////////////////////
  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const ref = doc(db, "usuarios", res.user.uid);
      const snap = await getDoc(ref);

      // 🔥 SOLO crear si NO existe
      if (!snap.exists()) {
        await setDoc(ref, {
          email: res.user.email,
          peso: "",
          meta: "",
          racha: 0,
          progreso: 0,
          pro: false,
        });
      }

      alert("Login correcto");
    } catch (err: any) {
      alert(err.message);
    }
  };

  //////////////////////////////////////////
  // 🆕 REGISTRO
  //////////////////////////////////////////
  const register = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "usuarios", res.user.uid), {
        email: res.user.email,
        peso: "",
        meta: "",
        racha: 0,
        progreso: 0,
        pro: false,
      });

      alert("Cuenta creada");
    } catch (err: any) {
      alert(err.message);
    }
  };

  //////////////////////////////////////////
  // 💾 GUARDAR PROGRESO
  //////////////////////////////////////////
  const guardar = async () => {
    if (!user) return;

    const nuevoProgreso =
      meta && peso
        ? Math.min((parseFloat(peso) / parseFloat(meta)) * 100, 100)
        : 0;

    await updateDoc(doc(db, "usuarios", user.uid), {
      peso,
      meta,
      progreso: nuevoProgreso,
      racha: racha + 1,
    });

    setProgreso(nuevoProgreso);
    setRacha(racha + 1);

    alert("Progreso guardado");
  };

  //////////////////////////////////////////
  // 💳 PAGO PRO
  //////////////////////////////////////////
  const comprarPro = async () => {
    if (!user) return;

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ userId: user.uid }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  //////////////////////////////////////////
  // UI LOGIN
  //////////////////////////////////////////
  if (!user) {
    return (
      <main style={styles.container}>
        <h1>💪 FitStartPro</h1>

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
          Login
        </button>

        <button onClick={register} style={styles.button}>
          Crear cuenta
        </button>
      </main>
    );
  }

  //////////////////////////////////////////
  // UI APP
  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h2>👋 {user.email}</h2>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Cerrar sesión
      </button>

      {/* PROGRESO */}
      <div style={styles.card}>
        <h3>📊 Progreso Total</h3>
        <p>{Math.round(progreso)}%</p>
      </div>

      {/* RACHA */}
      <div style={styles.card}>
        <h3>🔥 Racha: {racha}</h3>
      </div>

      {/* FORM */}
      <div style={styles.card}>
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

        <button onClick={guardar} style={styles.button}>
          Guardar progreso
        </button>
      </div>

      {/* PRO */}
      <div style={styles.card}>
        <h3>💎 Versión PRO</h3>
        <p>Desbloquea todas las rutinas</p>

        {pro ? (
          <p style={{ color: "#22c55e" }}>Eres PRO 🔥</p>
        ) : (
          <button onClick={comprarPro} style={styles.button}>
            Comprar PRO
          </button>
        )}
      </div>
    </main>
  );
}

//////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
    marginTop: "10px",
  },
  logout: {
    background: "red",
    padding: "8px",
    border: "none",
    color: "white",
    marginBottom: "20px",
  },
};