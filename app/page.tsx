"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const COLLECTION = "usuarios";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);
  const [pro, setPro] = useState(false);

  //////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////
  const login = async () => {
  try {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Validación básica
    if (!cleanEmail || !cleanPassword) {
      alert("Completa todos los campos");
      return;
    }

    if (!cleanEmail.includes("@")) {
      alert("Correo inválido");
      return;
    }

    const res = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      cleanPassword
    );

    const ref = doc(db, COLLECTION, res.user.uid);
    const snap = await getDoc(ref);

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
    console.error(err);

    if (err.code === "auth/invalid-email") {
      alert("Correo inválido");
    } else if (err.code === "auth/user-not-found") {
      alert("Usuario no existe");
    } else if (err.code === "auth/wrong-password") {
      alert("Contraseña incorrecta");
    } else {
      alert("Error: " + err.message);
    }
  }
};

  //////////////////////////////////////////
  // SESIÓN
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
          setPro(data.pro || false);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // GUARDAR
  //////////////////////////////////////////
  const guardar = async () => {
    try {
      if (!user) {
        alert("No hay usuario");
        return;
      }

      const pesoNum = parseFloat(peso);
      const metaNum = parseFloat(meta);

      if (isNaN(pesoNum) || isNaN(metaNum)) {
        alert("Ingresa números válidos");
        return;
      }

      const nuevoProgreso = Math.min((pesoNum / metaNum) * 100, 100);

      const ref = doc(db, COLLECTION, user.uid);

      await setDoc(
        ref,
        {
          peso,
          meta,
          progreso: nuevoProgreso,
          racha: racha + 1,
        },
        { merge: true }
      );

      setProgreso(nuevoProgreso);
      setRacha(racha + 1);

      alert("✅ Progreso guardado");
    } catch (error: any) {
      console.error(error);
      alert("❌ Error: " + error.message);
    }
  };

  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1>💪 FitStartPro</h1>

      {!user ? (
        <>
          <input
            style={styles.input}
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Contraseña"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={login}>
            Login
          </button>
        </>
      ) : (
        <>
          <p>👋 {user.email}</p>

          <p style={{ fontSize: "10px", opacity: 0.7 }}>
            UID: {user.uid}
          </p>

          <button style={styles.logout} onClick={() => signOut(auth)}>
            Cerrar sesión
          </button>

          <div style={styles.card}>
            <h2>📊 Progreso</h2>
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

          {!pro && (
            <div style={styles.card}>
              <h2>💎 Versión PRO</h2>
              <button style={styles.button}>Comprar PRO</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
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
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "10px",
  },
};