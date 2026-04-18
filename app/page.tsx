"use client";

import { useEffect, useState } from "react";
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
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);

  //////////////////////////////////////////
  // 🔐 VALIDACIÓN ANTI-SPAM
  //////////////////////////////////////////
  const canAttempt = () => {
    const now = Date.now();
    if (now - lastAttempt < 2000) {
      alert("⏳ Espera 2 segundos antes de intentar de nuevo");
      return false;
    }
    setLastAttempt(now);
    return true;
  };

  //////////////////////////////////////////
  // 🔐 LOGIN
  //////////////////////////////////////////
  const login = async () => {
    if (!canAttempt()) return;

    try {
      setLoading(true);

      if (!email.includes("@")) {
        alert("Correo inválido");
        return;
      }

      if (password.length < 6) {
        alert("Mínimo 6 caracteres");
        return;
      }

      await signInWithEmailAndPassword(auth, email.trim(), password.trim());

      alert("✅ Bienvenido");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        alert("❌ Usuario no existe");
      } else if (err.code === "auth/wrong-password") {
        alert("❌ Contraseña incorrecta");
      } else if (err.code === "auth/too-many-requests") {
        alert("⚠️ Demasiados intentos. Intenta más tarde");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////
  // 🆕 REGISTER
  //////////////////////////////////////////
  const register = async () => {
    if (!canAttempt()) return;

    try {
      setLoading(true);

      if (!email.includes("@")) {
        alert("Correo inválido");
        return;
      }

      if (password.length < 6) {
        alert("Mínimo 6 caracteres");
        return;
      }

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      // 🔥 Crear usuario en Firestore
      await setDoc(doc(db, COLLECTION, userCred.user.uid), {
        email: userCred.user.email,
        peso: "",
        meta: "",
        progreso: 0,
        racha: 0,
        pro: false,
      });

      alert("✅ Cuenta creada");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        alert("⚠️ Ese correo ya está registrado");
      } else if (err.code === "auth/too-many-requests") {
        alert("⚠️ Demasiados intentos. Intenta más tarde");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////
  // 🔄 SESIÓN
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
  // 💾 GUARDAR PROGRESO
  //////////////////////////////////////////
  const guardar = async () => {
    if (!user) return;

    const pesoNum = parseFloat(peso);
    const metaNum = parseFloat(meta);

    if (isNaN(pesoNum) || isNaN(metaNum)) {
      alert("Valores inválidos");
      return;
    }

    const nuevoProgreso = Math.min((pesoNum / metaNum) * 100, 100);

    await setDoc(
      doc(db, COLLECTION, user.uid),
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

    alert("✅ Guardado");
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

          <button style={styles.button} onClick={login} disabled={loading}>
            Iniciar sesión
          </button>

          <button style={styles.buttonAlt} onClick={register} disabled={loading}>
            Crear cuenta
          </button>
        </>
      ) : (
        <>
          <p>👋 {user.email}</p>

          <button style={styles.logout} onClick={() => signOut(auth)}>
            Cerrar sesión
          </button>

          <div style={styles.card}>
            <p>📊 {progreso.toFixed(0)}%</p>
            <p>🔥 Racha: {racha}</p>
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

          <button style={styles.button} onClick={guardar}>
            Guardar progreso
          </button>
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
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#22c55e",
    marginTop: "10px",
    borderRadius: "8px",
  },
  buttonAlt: {
    width: "100%",
    padding: "10px",
    background: "#3b82f6",
    marginTop: "10px",
    borderRadius: "8px",
  },
  logout: {
    background: "red",
    padding: "8px",
    marginTop: "10px",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "10px",
  },
};