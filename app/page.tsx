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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
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
      if (!email.includes("@")) {
        alert("Correo inválido");
        return;
      }

      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
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
        Iniciar sesión
      </button>

      <button onClick={register} style={styles.button}>
        Crear cuenta
      </button>
    </div>
  );
}

//////////////////////////////////////////
// 🏋️ APP PRINCIPAL
//////////////////////////////////////////

function App({ user }: { user: User }) {
  const [completados, setCompletados] = useState<string[]>([]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho",
      ejercicios: ["Press banca", "Press inclinado", "Fondos"],
    },
    {
      dia: "Día 2 - Espalda",
      ejercicios: ["Dominadas", "Remo con barra", "Jalón al pecho"],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: ["Sentadillas", "Prensa", "Pantorrillas"],
    },
    {
      dia: "Día 4 - Hombro",
      ejercicios: ["Press militar", "Elevaciones laterales", "Pájaros"],
    },
  ];

  //////////////////////////////////////////
  // 📥 CARGAR DESDE FIREBASE
  //////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setCompletados(data.completados || []);
          console.log("📥 Datos cargados");
        } else {
          console.log("⚠️ Usuario nuevo");
        }
      } catch (e) {
        console.log("❌ Error cargando", e);
      }
    };

    loadData();
  }, [user]);

  //////////////////////////////////////////
  // ☁️ GUARDAR EN FIREBASE
  //////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    const saveData = async () => {
      try {
        await setDoc(
          doc(db, "usuarios", user.uid),
          { completados },
          { merge: true }
        );

        console.log("✅ Guardado");
      } catch (e) {
        console.log("❌ Error guardando", e);
      }
    };

    saveData();
  }, [completados, user]);

  const toggle = (ejercicio: string) => {
    if (completados.includes(ejercicio)) {
      setCompletados(completados.filter((e) => e !== ejercicio));
    } else {
      setCompletados([...completados, ejercicio]);
    }
  };

  return (
    <main style={styles.container}>
      <h2>Bienvenido {user.email}</h2>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Cerrar sesión
      </button>

      {rutinas.map((rutina, index) => {
        const completadosDia = rutina.ejercicios.filter((e) =>
          completados.includes(e)
        ).length;

        const total = rutina.ejercicios.length;
        const porcentaje = Math.round((completadosDia / total) * 100);

        return (
          <div key={index} style={styles.card}>
            <h3>{rutina.dia}</h3>

            {/* 🔥 Barra progreso */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${porcentaje}%`,
                }}
              />
            </div>

            <p>{porcentaje}% completado</p>

            {rutina.ejercicios.map((ejercicio, i) => (
              <p
                key={i}
                onClick={() => toggle(ejercicio)}
                style={{
                  cursor: "pointer",
                  color: completados.includes(ejercicio)
                    ? "#22c55e"
                    : "white",
                }}
              >
                {completados.includes(ejercicio) ? "✅ " : ""} {ejercicio}
              </p>
            ))}
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
    margin: "10px",
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
    borderRadius: "10px",
    width: "300px",
  },
  logout: {
    marginBottom: "20px",
    background: "red",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
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