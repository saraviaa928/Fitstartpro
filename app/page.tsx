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
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // datos usuario
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [racha, setRacha] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [pro, setPro] = useState(false);

  //////////////////////////////////////////
  // 🔐 ESCUCHAR LOGIN
  //////////////////////////////////////////
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await cargarDatos(u.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // 📥 CARGAR DATOS
  //////////////////////////////////////////
  const cargarDatos = async (uid: string) => {
    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data: any = snap.data();

      setPeso(data.peso || "");
      setMeta(data.meta || "");
      setRacha(data.racha || 0);
      setProgreso(data.progreso || 0);
      setPro(data.pro || false);
    }
  };

  //////////////////////////////////////////
  // 💾 GUARDAR DATOS
  //////////////////////////////////////////
  const guardarDatos = async () => {
    await setDoc(
      doc(db, "usuarios", user.uid),
      {
        email: user.email,
        peso,
        meta,
        racha,
        progreso,
        pro,
      },
      { merge: true }
    );

    alert("✅ Datos guardados");
  };

  //////////////////////////////////////////
  // 🔐 LOGIN
  //////////////////////////////////////////
  const login = async () => {
    if (!email.includes("@")) {
      alert("Correo inválido");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      await setDoc(
        doc(db, "usuarios", res.user.uid),
        {
          email: res.user.email,
          peso: "",
          meta: "",
          racha: 0,
          progreso: 0,
          pro: false,
        },
        { merge: true }
      );

    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  //////////////////////////////////////////
  // 🆕 REGISTRO
  //////////////////////////////////////////
  const register = async () => {
    if (!email.includes("@")) {
      alert("Correo inválido");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "usuarios", res.user.uid), {
        email: res.user.email,
        peso: "",
        meta: "",
        racha: 0,
        progreso: 0,
        pro: false,
      });

    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  //////////////////////////////////////////
  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  //////////////////////////////////////////
  // 🔐 NO LOGIN
  //////////////////////////////////////////
  if (!user) {
    return (
      <main style={styles.container}>
        <h1>🔥 FitStartPro</h1>

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
  // 🧠 HOME
  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1>👋 {user.email}</h1>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Cerrar sesión
      </button>

      <div style={styles.card}>
        <h2>📊 Progreso Total</h2>
        <p>{progreso}%</p>
      </div>

      <div style={styles.card}>
        <h2>🔥 Racha: {racha}</h2>
      </div>

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

        <button onClick={guardarDatos} style={styles.button}>
          Guardar progreso
        </button>
      </div>

      {!pro && (
        <div style={styles.card}>
          <h2>💎 Versión PRO</h2>
          <p>Desbloquea todas las rutinas</p>
          <button style={styles.button}>
            Comprar PRO
          </button>
        </div>
      )}
    </main>
  );
}

//////////////////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////////////////
const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  input: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
    width: "100%",
  },
  logout: {
    background: "red",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    marginBottom: "20px",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
  },
};