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

  if (loading) return <div style={styles.loading}>Cargando...</div>;

  if (!user) return <LoginScreen />;

  return <AppScreen user={user} />;
}

//////////////////////////
// 🔐 LOGIN
//////////////////////////

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch {
      alert("Error al iniciar sesión");
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch {
      alert("Error al crear cuenta");
    }
  };

  return (
    <div style={styles.center}>
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
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        style={styles.input}
      />

      <button onClick={login} style={styles.button}>Login</button>
      <button onClick={register} style={styles.button}>Crear cuenta</button>
    </div>
  );
}

//////////////////////////
// 🏠 APP
//////////////////////////

function AppScreen({ user }: { user: User }) {
  const [tab, setTab] = useState("home");

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen user={user} />}
        {tab === "rutinas" && <RutinasScreen user={user} />}
        {tab === "perfil" && <PerfilScreen user={user} />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

//////////////////////////
// 🏠 HOME
//////////////////////////

function HomeScreen({ user }: { user: User }) {
  return (
    <>
      <h1>💪 Bienvenido</h1>
      <p>{user.email}</p>

      <button onClick={() => signOut(auth)} style={styles.button}>
        Cerrar sesión
      </button>
    </>
  );
}

//////////////////////////
// 🏋️ RUTINAS PRO
//////////////////////////

function RutinasScreen({ user }: { user: User }) {
  const [completados, setCompletados] = useState<string[]>([]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho y Tríceps",
      ejercicios: [
        "Press banca",
        "Press inclinado",
        "Aperturas",
        "Fondos",
      ],
    },
    {
      dia: "Día 2 - Espalda y Bíceps",
      ejercicios: [
        "Dominadas",
        "Remo con barra",
        "Curl bíceps",
        "Curl martillo",
      ],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: [
        "Sentadillas",
        "Prensa",
        "Peso muerto",
        "Pantorrillas",
      ],
    },
    {
      dia: "Día 4 - Hombro",
      ejercicios: [
        "Press militar",
        "Elevaciones laterales",
        "Pájaros",
        "Encogimientos",
      ],
    },
  ];

  // 🔥 CARGAR PROGRESO
  useEffect(() => {
    const cargar = async () => {
      try {
        const ref = doc(db, "progresos", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCompletados(snap.data().ejercicios || []);
        }
      } catch (e) {
        console.error(e);
      }
    };

    cargar();
  }, [user]);

  // 🔥 GUARDAR PROGRESO
  const guardar = async (data: string[]) => {
    try {
      await setDoc(doc(db, "progresos", user.uid), {
        ejercicios: data,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggle = (ejercicio: string) => {
    let nuevos;

    if (completados.includes(ejercicio)) {
      nuevos = completados.filter((e) => e !== ejercicio);
    } else {
      nuevos = [...completados, ejercicio];
    }

    setCompletados(nuevos);
    guardar(nuevos);
  };

  return (
    <div style={{ textAlign: "left", color: "white" }}>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((rutina, index) => {
        const completadosDia = rutina.ejercicios.filter((e) =>
          completados.includes(e)
        ).length;

        const total = rutina.ejercicios.length;
        const porcentaje = Math.round((completadosDia / total) * 100);

        return (
          <div key={index} style={styles.rutinaCard}>
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

            <p style={{ fontSize: "12px" }}>
              {porcentaje}% completado
            </p>

            <ul>
              {rutina.ejercicios.map((ejercicio, i) => {
                const done = completados.includes(ejercicio);

                return (
                  <li
                    key={i}
                    onClick={() => toggle(ejercicio)}
                    style={{
                      cursor: "pointer",
                      textDecoration: done ? "line-through" : "none",
                      color: done ? "#22c55e" : "white",
                    }}
                  >
                    {done ? "✅ " : ""}{ejercicio}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

//////////////////////////
// 👤 PERFIL
//////////////////////////

function PerfilScreen({ user }: { user: User }) {
  return (
    <>
      <h2>Perfil</h2>
      <p>{user.email}</p>
    </>
  );
}

//////////////////////////
// 🎨 ESTILOS
//////////////////////////

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  card: {
    padding: "20px",
    color: "white",
    textAlign: "center",
  },

  nav: {
    display: "flex",
    justifyContent: "space-around",
    background: "#111827",
    padding: "10px",
  },

  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    background: "#0f172a",
    color: "white",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    background: "#22c55e",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "white",
  },

  rutinaCard: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
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

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};