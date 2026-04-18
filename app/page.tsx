"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const COLLECTION = "usuarios";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);

  //////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, COLLECTION, userCred.user.uid), {
        email,
        progreso: 0,
        racha: 0,
      });
    }
  };

  //////////////////////////////////////////
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        const snap = await getDoc(doc(db, COLLECTION, u.uid));
        if (snap.exists()) {
          const data: any = snap.data();
          setPeso(data.peso || "");
          setMeta(data.meta || "");
          setProgreso(data.progreso || 0);
          setRacha(data.racha || 0);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  const guardar = async () => {
    if (!user) return;

    const nuevo = Math.min(
      (parseFloat(peso) / parseFloat(meta)) * 100,
      100
    );

    await setDoc(
      doc(db, COLLECTION, user.uid),
      {
        peso,
        meta,
        progreso: nuevo,
        racha: racha + 1,
      },
      { merge: true }
    );

    setProgreso(nuevo);
    setRacha(racha + 1);
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
          <button style={styles.btn} onClick={login}>
            Entrar
          </button>
        </>
      ) : (
        <>
          <p>{user.email}</p>

          <button onClick={() => signOut(auth)}>Salir</button>

          <div style={styles.card}>
            <p>Progreso: {progreso.toFixed(0)}%</p>
            <p>🔥 {racha} días</p>
          </div>

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

          <button style={styles.btn} onClick={guardar}>
            Guardar
          </button>

          <button
            style={styles.btn}
            onClick={() => router.push("/rutinas")}
          >
            Ver rutinas
          </button>
        </>
      )}

      {/* 🔥 NAVBAR */}
      <Navbar />
    </main>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    paddingBottom: "80px", // 🔥 espacio para navbar
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
  },
  btn: {
    marginTop: "10px",
    padding: "10px",
    background: "#22c55e",
    borderRadius: "8px",
    border: "none",
  },
  card: {
    background: "#1e293b",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "10px",
  },
};