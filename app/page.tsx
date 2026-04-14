"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
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
        Login
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
  const [tab, setTab] = useState("rutinas");
  const [completados, setCompletados] = useState<string[]>([]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho",
      ejercicios: ["Press banca", "Press inclinado", "Fondos"],
    },
    {
      dia: "Día 2 - Espalda",
      ejercicios: ["Dominadas", "Remo", "Jalón"],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: ["Sentadilla", "Prensa", "Pantorrilla"],
    },
  ];

  //////////////////////////////////////////
  // ☁️ CARGAR DESDE FIREBASE
  //////////////////////////////////////////
  useEffect(() => {
    const loadData = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCompletados(snap.data().completados || []);
        }
      } catch (e) {
        console.log("Error cargando datos");
      }
    };

    loadData();
  }, [user]);

  //////////////////////////////////////////
  // ☁️ GUARDAR EN FIREBASE
  //////////////////////////////////////////
  useEffect(() => {
    const saveData = async () => {
      try {
        await setDoc(doc(db, "usuarios", user.uid), {
          completados,
        });
      } catch (e) {
        console.log("Error guardando");
      }
    };

    if (user) saveData();
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

      {rutinas.map((r, i) => (
        <div key={i} style={styles.card}>
          <h3>{r.dia}</h3>

          {r.ejercicios.map((e, j) => (
            <p
              key={j}
              onClick={() => toggle(e)}
              style={{
                cursor: "pointer",
                color: completados.includes(e) ? "#22c55e" : "white",
              }}
            >
              {completados.includes(e) ? "✅ " : ""} {e}
            </p>
          ))}
        </div>
      ))}
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
  },
};