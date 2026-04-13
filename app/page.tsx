"use client";
import { useState, useEffect } from "react";

// 🔥 Firebase
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Detectar usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  // 🔐 Si NO hay usuario → Login
  if (!user) return <LoginScreen />;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen user={user} />}
        {tab === "rutinas" && <RutinasScreen />}
        {tab === "nutricion" && <NutricionScreen />}
        {tab === "perfil" && <PerfilScreen user={user} />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("nutricion")} style={styles.navItem}>🍎</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

// 🔐 LOGIN
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Bienvenido 🔥");
    } catch (e) {
      alert("Error al iniciar sesión");
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Cuenta creada 🚀");
    } catch (e) {
      alert("Error al registrarse");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 FitStartPro</h2>

        <input
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
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
    </div>
  );
}

// 🏠 HOME
function HomeScreen({ user }: any) {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido: {user.email}</p>
    </>
  );
}

// 🏋️ RUTINAS
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("progreso");
    if (data) setCompletados(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("progreso", JSON.stringify(completados));
  }, [completados]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho",
      ejercicios: ["Press banca", "Aperturas"],
    },
    {
      dia: "Día 2 - Espalda",
      ejercicios: ["Dominadas", "Remo"],
    },
  ];

  const toggleEjercicio = (ejercicio: string) => {
    setCompletados((prev) =>
      prev.includes(ejercicio)
        ? prev.filter((e) => e !== ejercicio)
        : [...prev, ejercicio]
    );
  };

  return (
    <div style={{ textAlign: "left" }}>
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

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${porcentaje}%`,
                }}
              />
            </div>

            <p>{porcentaje}% completado</p>

            <ul>
              {rutina.ejercicios.map((e, i) => (
                <li key={i} onClick={() => toggleEjercicio(e)}>
                  {completados.includes(e) ? "✅ " : ""}{e}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// 🍎
function NutricionScreen() {
  return <h2>🍎 Nutrición</h2>;
}

// 👤 PERFIL
function PerfilScreen({ user }: any) {
  const logout = () => signOut(auth);

  return (
    <>
      <h2>👤 Perfil</h2>
      <p>{user.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </>
  );
}

// 🎨 ESTILOS
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    padding: "10px 0",
  },
  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#22c55e",
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
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
};