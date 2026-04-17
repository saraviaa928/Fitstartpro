"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

//////////////////////////////////////////
// 🔥 CONSTANTE GLOBAL (ANTI ERRORES)
//////////////////////////////////////////
const COLLECTION = "usuarios";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);

  //////////////////////////////////////////
  // 🔐 LOGIN
  //////////////////////////////////////////
  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const ref = doc(db, COLLECTION, res.user.uid);
      const snap = await getDoc(ref);

      // 🔥 SOLO crea si no existe
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
  // 🔐 SESIÓN
  //////////////////////////////////////////
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        const ref = doc(db, COLLECTION, u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data: any = snap.data();
          setPeso(data.peso || "");
          setMeta(data.meta || "");
          setProgreso(data.progreso || 0);
          setRacha(data.racha || 0);
        }
      }
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // 💾 GUARDAR PROGRESO
  //////////////////////////////////////////
  const guardar = async () => {
    if (!user) return;

    if (!peso || !meta) {
      alert("Completa peso y meta");
      return;
    }

    const pesoNum = parseFloat(peso);
    const metaNum = parseFloat(meta);

    if (isNaN(pesoNum) || isNaN(metaNum) || metaNum === 0) {
      alert("Datos inválidos");
      return;
    }

    const nuevoProgreso = Math.min((pesoNum / metaNum) * 100, 100);

    await updateDoc(doc(db, COLLECTION, user.uid), {
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
  // 🎨 UI
  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      {!user ? (
        <>
          <input
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={login}>
            Iniciar sesión
          </button>
        </>
      ) : (
        <>
          <p>👋 {user.email}</p>

          <button style={styles.logout} onClick={() => signOut(auth)}>
            Cerrar sesión
          </button>

          <div style={styles.card}>
            <h2>📊 Progreso Total</h2>
            <p>{progreso.toFixed(0)}%</p>
          </div>

          <div style={styles.card}>
            <h2>🔥 Racha: {racha}</h2>
          </div>

          <div style={styles.card}>
            <input
              style={styles.input}
              placeholder="Peso"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Meta"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />

            <button style={styles.button} onClick={guardar}>
              Guardar progreso
            </button>
          </div>
        </>
      )}
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
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
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
    margin: "10px 0",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "10px",
  },
};