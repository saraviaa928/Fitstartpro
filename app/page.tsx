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
  const [pro, setPro] = useState(false);

  //////////////////////////////////////////
  // 🔐 Anti-spam
  //////////////////////////////////////////
  const canAttempt = () => {
    const now = Date.now();
    if (now - lastAttempt < 2000) {
      alert("⏳ Espera 2 segundos");
      return false;
    }
    setLastAttempt(now);
    return true;
  };

  //////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////
  const login = async () => {
    if (!canAttempt()) return;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      alert("✅ Bienvenido");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        alert("Usuario no existe");
      } else if (err.code === "auth/wrong-password") {
        alert("Contraseña incorrecta");
      } else if (err.code === "auth/too-many-requests") {
        alert("Demasiados intentos");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////
  // REGISTER
  //////////////////////////////////////////
  const register = async () => {
    if (!canAttempt()) return;

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

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
        alert("Correo ya registrado");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////
  // SESIÓN
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
          setPro(data.pro || false);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // GUARDAR PROGRESO
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
      <div style={styles.header}>
        <h1 style={styles.title}>FitStartPro</h1>
        {user && (
          <button style={styles.logout} onClick={() => signOut(auth)}>
            Salir
          </button>
        )}
      </div>

      {!user ? (
        <div style={styles.authBox}>
          <h2>Bienvenido 💪</h2>

          <input
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.primaryBtn} onClick={login} disabled={loading}>
            Iniciar sesión
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={register}
            disabled={loading}
          >
            Crear cuenta
          </button>
        </div>
      ) : (
        <>
          <div style={styles.profileCard}>
            <p>{user.email}</p>
            <small>{user.uid}</small>
          </div>

          <div style={styles.progressCard}>
            <h3>Progreso</h3>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progreso}%`,
                }}
              />
            </div>
            <p>{progreso.toFixed(0)}%</p>
          </div>

          <div style={styles.card}>
            <h3>🔥 Racha</h3>
            <p style={styles.big}>{racha} días</p>
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

            <button style={styles.primaryBtn} onClick={guardar}>
              Guardar progreso
            </button>
          </div>

          {/* 🔥 NUEVO BOTÓN */}
          <button
            style={styles.primaryBtn}
            onClick={() => (window.location.href = "/rutinas")}
          >
            Ver rutinas
          </button>

          {!pro && (
            <div style={styles.proCard}>
              <h3>💎 PRO</h3>
              <p>Desbloquea funciones avanzadas</p>
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
    background: "linear-gradient(#020617, #0f172a)",
    color: "white",
    padding: "20px",
  },
  header: { display: "flex", justifyContent: "space-between" },
  title: { fontSize: "24px" },
  input: {
    padding: "12px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
    border: "none",
    marginTop: "10px",
  },
  primaryBtn: {
    padding: "12px",
    background: "#22c55e",
    borderRadius: "10px",
    marginTop: "10px",
  },
  secondaryBtn: {
    padding: "12px",
    background: "#334155",
    borderRadius: "10px",
    marginTop: "10px",
  },
  logout: { background: "red", padding: "8px", borderRadius: "8px" },
  card: {
    background: "#1e293b",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "12px",
  },
  profileCard: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
  },
  progressCard: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
  },
  progressBar: {
    height: "10px",
    background: "#334155",
    borderRadius: "10px",
  },
  progressFill: {
    height: "100%",
    background: "#22c55e",
  },
  big: { fontSize: "28px" },
  proCard: {
    background: "linear-gradient(#22c55e,#16a34a)",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "12px",
    color: "black",
  },
};